const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();

    console.log("Deploying contracts with the account:", deployer.address);

    const MyToken = await ethers.getContractFactory("Token");
    const myToken = await MyToken.deploy("Token", "SAT", ethers.parseEther("1000000"), deployer.address);

    console.log("Token deployed to:", myToken.target);
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
