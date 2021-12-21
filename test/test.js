const { expect } = require("chai");
const { ethers } = require("hardhat");
const { TASK_COMPILE_SOLIDITY_GET_COMPILATION_JOB_FOR_FILE } = require("hardhat/builtin-tasks/task-names");


describe("Token contract", function () {

  let Token;
  let hardhatToken;
  let owner;
  let addr1;
  let addr2;
  let addrs;

  beforeEach(async function () {
    // Get the ContractFactory and Signers here.
    Token = await ethers.getContractFactory("TTTToken");
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    hardhatToken = await Token.deploy(15);
    await hardhatToken.deployed();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await hardhatToken.owner()).to.equal(owner.address);
    });

    it("Should assign the total supply of tokens to the owner", async function () {
      const ownerBalance = await hardhatToken.balanceOf(owner.address);
      expect(await hardhatToken.totalSupply()).to.equal(ownerBalance);
    });
  });
  describe("Whitelist", function () {
    it("Shoud set account to whitelist", async function () {
      await hardhatToken.addToWhitelist(addr1.address);
      expect(await hardhatToken.checkWhitelist(addr1.address)).to.equal(true);
      expect(await hardhatToken.checkWhitelist(addr2.address)).to.equal(false);
    });
    it("Should remove from whitelist",  async function () {
      await hardhatToken.addToWhitelist(addr1.address);
      expect(await hardhatToken.checkWhitelist(addr1.address)).to.equal(true);
      await hardhatToken.removeFromWhitelist(addr1.address);
      expect(await hardhatToken.checkWhitelist(addr1.address)).to.equal(false);
    });
    it("Shoud set many accounts to whitelist", async function () {
      await hardhatToken.addManyToWhitelist([addr1.address, addr2.address]);
      expect(await hardhatToken.checkWhitelist(addr1.address)).to.equal(true);
      expect(await hardhatToken.checkWhitelist(addr2.address)).to.equal(true);
    });
  } )

  describe("Transactions", function () {
    it("Should transfer tokens between accounts", async function () {
      
      await hardhatToken.transfer(addr1.address, 50);
      const addr1Balance = await hardhatToken.balanceOf(
        addr1.address
      );
      expect(addr1Balance).to.equal(50);

      await hardhatToken.addToWhitelist(addr1.address);
      await hardhatToken.connect(addr1).transfer(addr2.address, 50);
      const addr2Balance = await hardhatToken.balanceOf(
        addr2.address
      );
      expect(addr2Balance).to.equal(50);
    });

    it("Should fail if sender doesn’t have enough tokens", async function () {
      const initialOwnerBalance = await hardhatToken.balanceOf(
        owner.address
      );
      await hardhatToken.addToWhitelist(addr1.address);
      await expect(
        hardhatToken.connect(addr1).transfer(owner.address, 1)
      ).to.be.revertedWith("ERC20: transfer amount exceeds balance");

      expect(await hardhatToken.balanceOf(owner.address)).to.equal(
        initialOwnerBalance
      );
    });

    it("Should update balances after transfers", async function () {
      const initialOwnerBalance = await hardhatToken.balanceOf(
        owner.address
      );

      await hardhatToken.transfer(addr1.address, 100);

      await hardhatToken.transfer(addr2.address, 50);

      const finalOwnerBalance = await hardhatToken.balanceOf(
        owner.address
      );
      expect(finalOwnerBalance).to.equal(initialOwnerBalance - 150);

      const addr1Balance = await hardhatToken.balanceOf(
        addr1.address
      );
      expect(addr1Balance).to.equal(100);

      const addr2Balance = await hardhatToken.balanceOf(
        addr2.address
      );
      expect(addr2Balance).to.equal(50);
    });
  })
  
});






