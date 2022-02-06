module.exports = async function ({ getNamedAccounts, deployments }) {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  await deploy("Zap", {
    from: deployer,
    args: [],
    log: true,
    deterministicDeployment: false,
  });

  const zap = await ethers.getContract("Zap");
  const joe = await deployments.get("JoeToken");
  const router = await deployments.get("JoeRouter02");

  // this may be called only once, during the 1st deployment
  // may not be called a 2nd time; otherwise, will cause an error
  try {
    await zap.initialize(joe.address, router.address);
  } catch(err) {
    console.log("Error in `zap.initialize(...)`; no worries - it could've been initilized already;")
    console.log(`details: ${err}\r\n\r\n`)
  }
};

module.exports.tags = ["Zap"];
module.exports.dependencies = ["JoeRouter02", "JoeToken"];
