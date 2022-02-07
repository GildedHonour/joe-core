// Deploy for testing of MasterChefJoeV2
module.exports = async function ({ getNamedAccounts, deployments }) {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  const sushi = await ethers.getContract("SushiToken");
  const mcv1 = await ethers.getContract("MasterChef");
  const mcv2 = await ethers.getContract("MasterChefJoeV2");

  //this address exists on Avalanche > Fuji as well,
  //https://testnet.snowtrace.io/address/0x6d551Ad3570888D49DA4d6c8b8a626C8cbFD5AC2
  //but it's unclear whether or not its the same one as on Rinkeby
  //WAVAX-USDT on Rinkeby
  //const lpTokenAddress = "0x6d551ad3570888d49da4d6c8b8a626c8cbfd5ac2";

  //WAVAX-USDT on Avalanche > Fuji
  const lpTokenAddress = "0xF7Cd6FEB33Df1300121F4a757BaA25CA06B8D3EA";


  await deploy("ERC20Mock", {
    from: deployer,
    args: ["DummyToken", "DUMMY", "1"],
    log: true,
    deterministicDeployment: false,
  });

  await deploy("MasterChefRewarderPerBlock", {
    from: deployer,
    args: [
      sushi.address,
      lpTokenAddress,
      "100000000000000000000",
      "100",
      0,
      mcv1.address,
      mcv2.address,
    ],
    gasLmit: 22000000000,
    log: true,
    deterministicDeployment: false,
  });



  // this may be called only once, during the 1st deployment
  // may not be called a 2nd time; otherwise, will cause an error
  const dummyToken = await ethers.getContract("ERC20Mock");
  try {
    await (await mcv1.add("100", dummyToken.address, true)).wait();
  } catch(err) {
    console.log(`${err}\r\n`);
    console.log(`[*] no worries, the function 'mcv1.add(...)' could've been already called during the previous deploy`);
  }


  const rewarder = await ethers.getContract("MasterChefRewarderPerBlock");
  await dummyToken.approve(rewarder.address, "1");
  await rewarder.init(dummyToken.address, {
    gasLimit: 245000,
  });
};

module.exports.tags = ["MasterChefRewarderPerBlock"];
module.exports.dependencies = ["SushiToken", "MasterChef", "MasterChefJoeV2"];
