// const { helpers } = require('./helpers.js')

module.exports = async function ({ ethers, deployments, getNamedAccounts }) {
  const { deploy } = deployments;
  const { deployer, dev, treasury, investor } = await getNamedAccounts();
  const PID = 66;
  const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000"; //todo - into a helper

  await deploy("ERC20Mock", {
    from: deployer,
    args: ["Joe Dummy Token", "DUMMY", "1"],
    log: true,
    deterministicDeployment: false,
  });
  const dummyToken = await ethers.getContract("ERC20Mock");


  //it appears that this will cause an exception when called a 2nd and more times
  // await dummyToken.renounceOwnership(); 

  //1

  // try {
  //   await dummyToken.renounceOwnership();
  // } catch(err) {
  //   console.log(`${err}\r\n\r\n`);
  //   console.log(`no worries, the function 'dummyToken.renounceOwnership(...)' could've been already called during the previous deploy`);
  // }

  // or

  //2
  if ((await dummyToken.owner()) !== ZERO_ADDRESS) {
      console.log("[*] renouncing ownership of dummyToken...");
      await dummyToken.renounceOwnership();
      console.log("[*] ok");
  }


  const joe = await ethers.getContract("JoeToken");
  const mcv2 = await ethers.getContract("MasterChefJoeV2");
  await deploy("MasterChefJoeV3", {
    from: deployer,
    args: [mcv2.address, joe.address, PID],
    log: true,
    deterministicDeployment: false,
  });

  const rewarder = await ethers.getContract("MasterChefRewarderPerBlock"); // or "SimpleRewarderPerSec"?
  try {
    console.log("[*] adding 100 tokens to dummyToken...");
    await (await mcv2.add(100, dummyToken.address, rewarder.address)).wait();
    console.log("[*] ok");
  } catch (err) {
    console.log(`${err}\r\n`);
    console.log(`[*] no worries, the function 'mcv2.add(...)' could've been already called during the previous deploy`);
  }

  const mcv3 = await ethers.getContract("MasterChefJoeV3");
  await (await dummyToken.approve(mcv3.address, PID)).wait();

  await rewarder.init(dummyToken.address, {
    gasLimit: 245000,
  });
};

module.exports.tags = ["MasterChefJoeV3"];
module.exports.dependencies = [
  "JoeFactory",
  "JoeRouter02",
  "JoeToken",
  "MasterChefJoeV2",

  /*"SimpleRewarderPerSec",*/
  "MasterChefRewarderPerBlock"
];