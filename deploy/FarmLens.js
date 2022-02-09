const { WAVAX } = require("@traderjoe-xyz/sdk");

module.exports = async function ({ getNamedAccounts, deployments }) {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = await getChainId();

  let wavaxAddress;
  let wavaxUsdtAddress;
  let wavaxUsdcAddress;
  let wavaxDaiAddress;

  if (chainId === "31337") {
    wavaxAddress = (await deployments.get("WAVAX9Mock")).address;
  } else if (chainId in WAVAX) {
    wavaxAddress = WAVAX[chainId].address;
  } else {
    throw Error("No WAVAX!");
  }

  //TODO: for the chain 43114
  //the names of the variables of 'wavaxUsdcAddress' and 'wavaxDaiAddress' have been confused
  //because in reality
  //wavaxUsdcAddress is JoePair of WAVAX-DAI
  //whereas
  //wavaxDaiAddress is JoePair of  WAVAX-USDC
  if (chainId === "43114") {
    wavaxUsdtAddress = "0xeD8CBD9F0cE3C6986b22002F03c6475CEb7a6256"; //JoePair of WAVAX-USDT
    wavaxUsdcAddress = "0x87Dee1cC9FFd464B79e058ba20387c1984aed86a"; //JoePair of WAVAX-USDC
    wavaxDaiAddress = "0xA389f9430876455C36478DeEa9769B7Ca4E3DDB1";  //JoePair of WAVAX-DAI
  } else if (chainId === "4") {
    wavaxUsdtAddress = "0x63fce17ba68c82a322fdd5a4d03aedbedbd730fd";
    wavaxUsdcAddress = "0x63fce17ba68c82a322fdd5a4d03aedbedbd730fd";
    wavaxDaiAddress = "0x63fce17ba68c82a322fdd5a4d03aedbedbd730fd";
  } else if (chainId === "43113") { //Avalanche > Fuji
    wavaxUsdtAddress = "0x5528f1355c070682a2B079a5dCA8129F568271Af";
    wavaxUsdcAddress = "0x5bc94145def1d0034fa08d64eff59e72b3a4f41d";
    wavaxDaiAddress = "0xCD4CF44B29cC8150F67A6447929C7B9f89d51827";
  }

  const joeAddress = (await deployments.get("JoeToken")).address;
  const joeFactoryAddress = (await deployments.get("JoeFactory")).address;
  const chefAddress = (await deployments.get("MasterChefJoeV2")).address;
  const chefAddressV3 = (await deployments.get("MasterChefJoeV3")).address;

  await deploy("FarmLens", {
    from: deployer,
    args: [
      joeAddress,
      wavaxAddress,
      wavaxUsdtAddress,
      wavaxUsdcAddress,
      wavaxDaiAddress,
      joeFactoryAddress,
      chefAddress,
      chefAddressV3,
    ],
    log: true,
    deterministicDeployment: false,
  });
};

module.exports.tags = ["FarmLens"];
module.exports.dependencies = [
  "JoeToken",
  "JoeFactory",
  "MasterChefJoeV2",
  "MasterChefJoeV3",
  "WAVAX9Mock",
];
