import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { Contract } from "ethers";

const deployPatentMarketplace: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  // 1. Get the already deployed PatentNFT contract instance
  const patentNFT = await hre.ethers.getContract<Contract>("PatentNFT", deployer);
  const patentNFTAddress = await patentNFT.getAddress();

  // 2. Deploy the PatentMarketplace contract
  await deploy("PatentMarketplace", {
    from: deployer,
    args: [patentNFTAddress, deployer, deployer],
    log: true,
    autoMine: true,
  });

  // --- Start of New Logic ---

  // 3. Get the newly deployed PatentMarketplace contract instance
  const patentMarketplace = await hre.ethers.getContract<Contract>("PatentMarketplace", deployer);
  const marketplaceAddress = await patentMarketplace.getAddress();

  // 4. Check the current owner of PatentNFT
  const patentNFTOwner = await (patentNFT as any).owner();

  // 5. Transfer ownership of PatentNFT to the marketplace, if it's not already the owner
  if (patentNFTOwner !== marketplaceAddress) {
    console.log(`Transferring ownership of PatentNFT to: ${marketplaceAddress}...`);
    const tx = await (patentNFT as any).transferOwnership(marketplaceAddress);
    await tx.wait();
    console.log("Ownership transferred successfully!");
    const newOwner = await (patentNFT as any).owner();
    console.log("New owner of PatentNFT is:", newOwner);
  } else {
    console.log("Ownership of PatentNFT already set to the PatentMarketplace.");
  }

  // --- End of New Logic ---
};

export default deployPatentMarketplace;
deployPatentMarketplace.tags = ["PatentMarketplace"];
deployPatentMarketplace.dependencies = ["PatentNFT"]; // Ensure PatentNFT is deployed first
