## Avalanche > Fuji

#### Faucet

https://faucet.avax-test.network


#### Contracts and tokens

Because Fuji is a testnet, there're multiple staiblecoins, with no official ones, and they may not always work as expected. 


**USDT**
0xafda926d549a67229d8db529638e0bafcdb66458

**USDC**
0x5425890298aed601595a70ab815c96711a31bc65


**DAI**
0x12c135a68b7b3cd006edb785cb53398a5da59613

**WAVAX**
0xd00ae08403B9bbb9124bB305C09058E32C39A48c


*Note that contracts on testnets may or may not work properly.*


#### Deployed JoePair contracts

`JoePair` contracts are used in `FarmLens`. In order to deploy a new `JoePair` contract, use `JoeFactory.createPair()` function as follows:

```
module.exports = async function ({ getNamedAccounts, deployments }) {
    const { deploy } = deployments;
    const { deployer } = await getNamedAccounts();


    //change to whatever tokens you need to deploy
    const WAVAX_FUJI = "0xd00ae08403B9bbb9124bB305C09058E32C39A48c";
    const DAI_FUJI = "0x12c135a68b7b3cd006edb785cb53398a5da59613";

    const ft = await ethers.getContract("JoeFactory");
    ft.createPair(WAVAX_FUJI, DAI_FUJI);

    //result: 'WAVAX-DAI' pair
};

```

The following `JoePair` contracts have been deployed on Fuji:

**WAVAX-USDT**
0x5528f1355c070682a2B079a5dCA8129F568271Af

**WAVAX-USDC**
0x5bc94145def1d0034fa08d64eff59e72b3a4f41d

**WAVAX-DAI**
0xCD4CF44B29cC8150F67A6447929C7B9f89d51827
