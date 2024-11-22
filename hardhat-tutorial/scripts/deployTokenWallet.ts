import { ethers } from "hardhat";

async function main() {
  // Get the deployer address and provider
  const [deployer] = await ethers.getSigners();
  const provider = ethers.provider;

  // Log the deployer's balance using the provider's getBalance function
  const deployerBalance = await provider.getBalance(deployer.address);
  console.log("Deployed from address: ", deployer.address);
  console.log("Deployer balance:", ethers.formatEther(deployerBalance));

  // Deploy the TokenWallet contract
  const TokenWallet = await ethers.getContractFactory("TokenWallet");

  // Mainnet Addresses (adjust accordingly if deploying on a different network)
  const tokenAddress = "0xdAC17F958D2ee523a2206206994597C13D831ec7"; // USDT address
  const usdtAddress = "0xdAC17F958D2ee523a2206206994597C13D831ec7"; // USDT address
  const uniswapRouterAddress = "0x7a250d5630b4cf539739df2c5dacf5c4cfae4dfc"; // Uniswap V2 Router

  // Deploy the TokenWallet contract with the constructor arguments
  const tokenWallet = await TokenWallet.deploy(
    tokenAddress,
    usdtAddress,
    uniswapRouterAddress,
    {
      gasLimit: "0x1000000",
    }
  );

  console.log("TokenWallet deployed at: ", tokenWallet.target);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
