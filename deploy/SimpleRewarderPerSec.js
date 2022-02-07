// Deploy for testing of MasterChefJoeV2
module.exports = async function ({ getNamedAccounts, deployments }) {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  // const rewardToken = "0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7";
  const rewardToken = "0xd00ae08403B9bbb9124bB305C09058E32C39A48c"; //WAVAX on Avalanche > Fuji

  // const lpToken = "0xb97F23A9e289B5F5e8732b6e20df087977AcC434";
  const lpToken = "0xF7Cd6FEB33Df1300121F4a757BaA25CA06B8D3EA";


  const mcv3 = await ethers.getContract("MasterChefJoeV3");
  const mcj = mcv3.address;

  await deploy("SimpleRewarderPerSec", {
    from: deployer,
    args: [rewardToken, lpToken, "0", mcj, true],
    gasLmit: 22000000000,
    log: true,
    deterministicDeployment: false,
  });
};

module.exports.tags = ["SimpleRewarderPerSec"];
module.dependencies = ["MasterChefJoeV3"];
