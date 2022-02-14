const { WAVAX } = require("@traderjoe-xyz/sdk");

module.exports = async function ({ getNamedAccounts, deployments }) {
  const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
  const DEV_ADDRESS = "0x8935737fe9f2ba410d48a625575858cb9b5bf279";
  const WAVAX_FUJI = "0xd00ae08403B9bbb9124bB305C09058E32C39A48c"; //todo - into a helper

  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  const jr = await ethers.getContract("JoeRouter02");

  await deploy("THORSMEAD", {
    from: deployer,
    args: [jr.address, DEV_ADDRESS],
    log: true,
    deterministicDeployment: false,
  });

  const thrmd = await ethers.getContract("THORSMEAD");
  const ft = await ethers.getContract("JoeFactory");
  const pr1 = await ft.getPair(thrmd.address, WAVAX_FUJI);
  if (pr1 === ZERO_ADDRESS) {
    const pr2 = await ft.createPair(thrmd.address, WAVAX_FUJI);
    console.log(`new pair of WAVAX and MEAD created at: ${pr2}`);
  }
};

module.exports.tags = ["THORSMEAD"];
module.exports.dependencies = ["JoeRouter02"];
