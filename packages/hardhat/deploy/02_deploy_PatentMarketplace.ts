import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { Contract } from "ethers";

const deployPatentMarketplace: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  // Get the already deployed PatentNFT contract instance
  const patentNFT = await hre.ethers.getContract<Contract>("PatentNFT", deployer);
  const patentNFTAddress = await patentNFT.getAddress();

  await deploy("PatentMarketplace", {
    from: deployer,
    // Args for the constructor: (_patentNFTAddress, _adminAddress, initialOwner)
    args: [patentNFTAddress, deployer, deployer],
    log: true,
    autoMine: true,
  });
};

export default deployPatentMarketplace;
deployPatentMarketplace.tags = ["PatentMarketplace"];
deployPatentMarketplace.dependencies = ["PatentNFT"]; // Ensure PatentNFT is deployed first
