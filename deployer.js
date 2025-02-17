const { ethers } = require("hardhat");
const hre = require("hardhat");
require("dotenv");

async function main() {
  const networkUrl = process.env.RPC; //"https://testnet-rpc.plumenetwork.xyz/http"; // Zeta network URL
  const privateKey = process.env.PRIVATE_KEY; // Fetch private key from environment variable
  const provider = new ethers.providers.JsonRpcProvider(networkUrl);
  const deployer = new ethers.Wallet(privateKey, provider);

  // const [deployer] = await ethers.getSigners();

  console.log(
    "Deploying contracts with the account:",
    deployer.address,
    networkUrl
  );

  const seaportFactory = await ethers.getContractFactory("OtcTokenFactory");
  const seaportFactory2 = await ethers.getContractFactory(
    "OtcTokenSpecialFactory"
  );

  // const conduitControllerFactory = await ethers.getContractFactory(
  //   "ConduitController"
  // );

  // const conduitController = await conduitControllerFactory
  //   .connect(deployer)
  //   .deploy();

  // await conduitController.deployed();
  // const overrides = {
  //   gasLimit: 6000000, // Set the desired gas limit here
  //   gasPrice: 10000000,
  // };

  console.log("next");

  const seaportContract = await seaportFactory.connect(deployer).deploy();

  const seaportContract2 = await seaportFactory2.connect(deployer).deploy();

  // console.log(seaportContract);
  console.log("next2");

  await seaportContract.deployed();
  await seaportContract2.deployed();

  console.log("next5");
  console.log("otc deployer deployed to " + seaportContract.address);
  console.log("otc deployer deployed to " + seaportContract2.address);

  const otcContract = await seaportContract.createToken(
    "test tokens",
    "otcs",
    deployer.address
  );

  await sleep(120 * 1000); // 2minutes

  console.log("next3");

  const otcContractSpecial = await seaportContract2.createToken(
    "test special tokens",
    "otcspecial",
    deployer.address
  );

  // console.log("otc deployer deployed to " + seaportContract.address);
  console.log("otc deployer deployed to " + seaportContract2.address);
  // console.log("otc contract deployed to " + otcContract.address);
  console.log("otc special contract deployed to " + otcContractSpecial.address);

  await sleep(45 * 1000);

  console.log(seaportContract2);

  await hre.run("verify:verify", {
    address: seaportContract2.address,
    etherscanAPIKey: process.env.EXPLORER_API_KEY,
  });

  console.log("done");

  // await sleep(45 * 1000);

  // await hre.run("verify:verify", {
  //   address: otcContractSpecial.target,
  // });
}

async function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.log(e);
    process.exit(1);
  });

// sepolia
// otc deployer deployed to 0xD4075B5c98A6F023761303A6D5230aaa53d8239D
// otc deployer deployed to 0x72E69F278665d887A75D1249045201726968739E    0xcF990ecd1700d7741cef58CC24de28352327720a
