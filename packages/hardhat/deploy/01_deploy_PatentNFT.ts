import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const deployPatentNFT: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  await deploy("PatentNFT", {
    from: deployer,
    // The constructor argument for PatentNFT is the initial owner
    args: [deployer],
    log: true,
    autoMine: true,
  });
};

export default deployPatentNFT;
deployPatentNFT.tags = ["PatentNFT"];
