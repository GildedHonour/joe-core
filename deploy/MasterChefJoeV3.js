module.exports = async function ({ ethers, deployments, getNamedAccounts }) {
  const { deploy } = deployments;
  const { deployer, dev, treasury, investor } = await getNamedAccounts();
  const PID = 66;
  const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

  await deploy("ERC20Mock", {
    from: deployer,
    args: ["Joe Dummy Token", "DUMMY", "1"],
    log: true,
    deterministicDeployment: false,
  });
  const dummyToken = await ethers.getContract("ERC20Mock");


  // await dummyToken.renounceOwnership(); //will cause an exception when called a 2nd and more times
  //fixme -- add try { } catch(e) {...}

  // try {
  //   await dummyToken.renounceOwnership();
  // } catch(err) {
  //   console.log(`${err}\r\n\r\n`);
  //   console.log(`no worries, the function 'dummyToken.renounceOwnership(...)' could've been already called during the previous deploy`);
  // }


  // or
  if ((await dummyToken.owner()) !== ZERO_ADDRESS) {
      await dummyToken.renounceOwnership();
  }




  const joe = await ethers.getContract("JoeToken");
  const mcv2 = await ethers.getContract("MasterChefJoeV2");

  // // const { address } = await deploy("MasterChefJoeV3", {
  // //   from: deployer,
  // //   args: [mcv2.address, joe.address, PID],
  // //   log: true,
  // //   deterministicDeployment: false,
  // // });
  const mcv3 = await ethers.getContract("MasterChefJoeV3");





  const rewarder = await ethers.getContract("MasterChefRewarderPerBlock");
  // const rewarder = await ethers.getContract("SimpleRewarderPerSec");

  //fixme -- add try { } catch(e) {...}
  // await (await mcv2.add(100, dummyToken.address, false)).wait(); // wrong
  // await (await mcv2.add(100, dummyToken.address, rewarder.address)).wait();


  await (await dummyToken.approve(mcv3.address, PID)).wait();


  try {
    await (await mcv2.add(100, dummyToken.address, rewarder.address)).wait();
  } catch(err) {
    console.log(`${err}\r\n\r\n`);
    console.log(`no worries, the function 'mcv2.add(...)' could've been already called during the previous deploy`);
  }


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