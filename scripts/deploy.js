
const hre = require("hardhat");
const ethers = hre.ethers;
//const BigNumber = ethers.BigNumber;

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  console.log("Account balance:", (await deployer.getBalance()).toString());
  
  Token = await ethers.getContractFactory("TTTToken");
  hardhatToken = await Token.deploy(15);

  await hardhatToken.deployed();

  console.log("TTT Token address:", hardhatToken.address);

  Crowdsale = await ethers.getContractFactory("TTTCrowdsale");
  hardhatCrowdsale = await Crowdsale.deploy(hardhatToken.address);

  await hardhatCrowdsale.deployed();

  hardhatToken.addToWhitelist(hardhatCrowdsale.address);
  hardhatToken.transfer(hardhatCrowdsale.address, hardhatToken.totalSupply);
  
  console.log("TTT Crowdsale address:", hardhatCrowdsale.address);

  console.log("deployment finished successfully");
}


main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });