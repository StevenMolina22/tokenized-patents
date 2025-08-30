import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const deployRoyaltyToken: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  await deploy("RoyaltyToken", {
    from: deployer,
    // The constructor argument for RoyaltyToken is the initial owner
    args: [deployer],
    log: true,
    autoMine: true,
  });
};

export default deployRoyaltyToken;
deployRoyaltyToken.tags = ["RoyaltyToken"];
