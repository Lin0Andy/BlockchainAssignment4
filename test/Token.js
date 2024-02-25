const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("Token", function () {
    let MyToken;
    let myToken;
    let owner;
    let alice;
    let bob;

    beforeEach(async function () {
        [owner, alice, bob] = await ethers.getSigners();

        MyToken = await ethers.getContractFactory("Token");
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
        await myToken.transferTo(alice.address, ethers.parseEther("1000"));
        expect(await myToken.balanceOf(alice.address)).to.equal(ethers.parseEther("1000"));

        await myToken.connect(alice).transferTo(bob.address, ethers.parseEther("100"));
        expect(await myToken.balanceOf(bob.address)).to.equal(ethers.parseEther("100"));
    });

    it("Should not transfer tokens if sender does not have enough balance", async function () {
        await expect(myToken.connect(owner).transferTo(bob.address, ethers.parseEther("1000001"))).to.be.revertedWith("ERC20: transfer amount exceeds balance");
    });

    it("Should not allow setting block reward by non-owner", async function () {
        await expect(myToken.connect(alice).setBlockReward(100)).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("Should mint tokens as miner reward", async function () {
        await myToken.setBlockReward(100);
        await myToken.transfer(owner.address, 0);
        const expectedBalance = ethers.parseEther("1000000").add(ethers.parseEther("100"));
        expect(await myToken.balanceOf(owner.address)).to.equal(expectedBalance);
    });

    it("Should not allow destroying contract by non-owner", async function () {
        await expect(myToken.connect(alice).destroy()).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("Should destroy contract and transfer remaining tokens to owner", async function () {
        const initialBalance = await ethers.provider.getBalance(owner.address);
        await myToken.destroy();
        const finalBalance = await ethers.provider.getBalance(owner.address);
        expect(await myToken.totalSupply()).to.equal(0);
        expect(finalBalance.gt(initialBalance)).to.be.true;
    });
});
