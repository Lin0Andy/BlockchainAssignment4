const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("Token", function () {
    let MyToken;
    let myToken;
    let owner;
    let addr1;
    let addr2;

    beforeEach(async function () {
        MyToken = await ethers.getContractFactory("Token");
        [owner, addr1, addr2] = await ethers.getSigners();

        myToken = await MyToken.deploy("Token", "MYT", ethers.parseEther("1000000"), owner.address);
        await myToken.waitForDeployment();
    });

    it("Should deploy with correct initial state", async function () {
        expect(await myToken.name()).to.equal("Token");
        expect(await myToken.symbol()).to.equal("MYT");
        expect(await myToken.totalSupply()).to.equal(ethers.parseEther("1000000"));
        expect(await myToken.balanceOf(owner.address)).to.equal(ethers.parseEther("1000000"));
    });

    it("Should transfer tokens between accounts", async function () {
        await myToken.transfer(addr1.address, ethers.parseEther("1000"));
        expect(await myToken.balanceOf(addr1.address)).to.equal(ethers.parseEther("1000"));

        await myToken.connect(addr1).transfer(addr2.address, ethers.parseEther("100"));
        expect(await myToken.balanceOf(addr2.address)).to.equal(ethers.parseEther("100"));
    });

    it("Should not transfer tokens if sender does not have enough balance", async function () {
        await expect(myToken.connect(addr1).transfer(addr2.address, ethers.parseEther("1000001"))).to.be.revertedWith("ERC20: transfer amount exceeds balance");
    });

    it("Should not allow transferring to the token contract address", async function () {
        await expect(myToken.transfer(myToken.address, ethers.parseEther("100"))).to.be.revertedWith("ERC20: transfer to the token contract");
    });

    it("Should not allow setting block reward by non-owner", async function () {
        await expect(myToken.connect(addr1).setBlockReward(100)).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("Should mint tokens as miner reward", async function () {
        await myToken.setBlockReward(100);
        await myToken._mintMinerReward();
        expect(await myToken.balanceOf(owner.address)).to.equal(ethers.parseEther("1000000") + 100);
    });

    it("Should not allow destroying contract by non-owner", async function () {
        await expect(myToken.connect(addr1).destroy()).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("Should destroy contract and transfer remaining tokens to owner", async function () {
        const initialBalance = await owner.getBalance();
        await myToken.destroy();
        const finalBalance = await owner.getBalance();
        expect(await myToken.totalSupply()).to.equal(0);
        expect(finalBalance.gt(initialBalance)).to.be.true;
    });
});
