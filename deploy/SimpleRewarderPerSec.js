// Deploy for testing of MasterChefJoeV2
module.exports = async function ({ getNamedAccounts, deployments }) {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  const WAVAX_FUJI = "0xd00ae08403B9bbb9124bB305C09058E32C39A48c"; //todo - into a helper

  //1
  // const rewardToken = "0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7";
  const rewardToken = "0xd00ae08403B9bbb9124bB305C09058E32C39A48c"; //WAVAX on Avalanche > Fuji


  //2
  //JoePair:
  //  THORSMEAD (MEAD) 0x245C2591403e182e41d7A851eab53B01854844CE
  //  Wrapped AVAX (WAVAX) 0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7
  //
  // const lpToken = "0xb97F23A9e289B5F5e8732b6e20df087977AcC434";

  // instead, get its address dynamically from Avalanche > Fuji

  const thrmd = await ethers.getContract("THORSMEAD");
  const ft = await ethers.getContract("JoeFactory");
  const lpToken = await ft.getPair(thrmd.address, WAVAX_FUJI);
  console.log(`SimpleRewarderPerSec > lpToken (JoePair): ${lpToken}`)



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
