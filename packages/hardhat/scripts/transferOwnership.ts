import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Using account:", deployer.address);

  const patentNFT = await ethers.getContract("PatentNFT", deployer);
  const patentMarketplace = await ethers.getContract("PatentMarketplace", deployer);

  const marketplaceAddress = await patentMarketplace.getAddress();

  console.log(`Transferring ownership of PatentNFT to: ${marketplaceAddress}...`);

  const tx = await (patentNFT as any).transferOwnership(marketplaceAddress);
  await tx.wait();

  console.log("Ownership transferred successfully!");
  const newOwner = await (patentNFT as any).owner();
  console.log("New owner of PatentNFT is:", newOwner);
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
