import { ethers } from "hardhat";

async function main() {
  // const network = hardhatArguments.network ? hardhatArguments.network : 'dev';
  const [deployer] = await ethers.getSigners();
  const provider = ethers.provider;

  // Log the deployer's balance using the provider's getBalance function
  const deployerBalance = await provider.getBalance(deployer.address);
  console.log("deploy from address: ", deployer.address);

  console.log("Deployer balance:", ethers.formatEther(deployerBalance));

  const contract = await ethers.deployContract("Julia", {
    gasLimit: "0x1000000",
  });
  console.log("Contract deployed at: ", contract.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
