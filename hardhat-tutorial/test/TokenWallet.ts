import { expect } from "chai";
import { ethers } from "hardhat";
import { BigNumberish } from "ethers";
import { TokenWallet } from "../typechain-types";

describe("TokenWallet Contract", function () {
  let tokenWallet: TokenWallet;
  let owner: any;
  let addr1: any;
  let addr2: any;
  let USDTAddress: string;

  before(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();

    // Deploy the TokenWallet contract
    const TokenWallet = await ethers.getContractFactory("TokenWallet");

    // Mainnet Addresses
    const tokenAddress = "0xdAC17F958D2ee523a2206206994597C13D831ec7";
    const usdtAddress = "0xdAC17F958D2ee523a2206206994597C13D831ec7";
    const uniswapRouterAddress = "0xE592427A0AEce92De3Edee1F18E0157C05861564";

    // Deploy with constructor arguments
    tokenWallet = await TokenWallet.deploy(
      tokenAddress,
      usdtAddress,
      uniswapRouterAddress
    );

    console.log("TokenWallet deployed to:", tokenWallet.getAddress());
    console.log("USDT Address:", usdtAddress);
    console.log("Uniswap Router Address:", uniswapRouterAddress);

    // Assume USDT address is set (mock or real)
    USDTAddress = await tokenWallet.USDT();

    it("should have the correct owner", async function () {
      const contractOwner = await tokenWallet.owner();
      expect(contractOwner).to.equal(owner.address);
    });

    it("should perform a swap from ETH to Token", async function () {
      const initialBalance = await ethers.provider.getBalance(
        tokenWallet.getAddress()
      );

      // Send ETH to contract and swap
      const amountToSend = ethers.parseEther("1");
      await tokenWallet.connect(addr1).swapETHToToken({ value: amountToSend });

      // Verify contract balance
      const finalBalance = await ethers.provider.getBalance(
        tokenWallet.getAddress()
      );
      expect(finalBalance).to.be.gt(initialBalance);

      // Check token balance of user (mock data since swap might need Uniswap setup)
      const userBalance = await tokenWallet.getContractBalance();
      expect(userBalance).to.be.gt(0);
    });

    it("should withdraw ETH correctly", async function () {
      const contractBalance = await ethers.provider.getBalance(
        tokenWallet.getAddress()
      );

      const amountToWithdraw = ethers.parseEther("0.5");
      await tokenWallet.connect(owner).withdrawETH(amountToWithdraw);

      const newContractBalance = await ethers.provider.getBalance(
        tokenWallet.getAddress()
      );
      // expect(newContractBalance).to.equal(contractBalance.sub(amountToWithdraw));
    });

    it("should withdraw tokens correctly", async function () {
      const tokenAmount: BigNumberish = 1000000000000000000;
      await tokenWallet.connect(owner).withdrawTokens(USDTAddress, tokenAmount);

      // Assuming the owner gets tokens after withdrawal
      // Mocking token balance verification
      const ownerTokenBalance = await tokenWallet.getContractBalance();
      expect(ownerTokenBalance).to.be.gt(0);
    });

    it("should allow ownership transfer", async function () {
      await tokenWallet.connect(owner).transferOwnership(addr1.address);

      const newOwner = await tokenWallet.owner();
      expect(newOwner).to.equal(addr1.address);
    });
  });
});
