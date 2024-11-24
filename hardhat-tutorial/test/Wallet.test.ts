import { expect } from "chai";
import { ethers } from "hardhat";
import { IERC20, Wallet } from "../typechain-types";

describe("Wallet Contract", function () {
  let owner: any, user: any, wallet: Wallet;
  let jltToken: IERC20, usdtToken: IERC20;
  const JLT_ADDRESS = "0x425eea9d65f20ce7FB56D810F8fD2697c717879a"; // JLT Token Address
  const USDT_ADDRESS = "0xdac17f958d2ee523a2206206994597c13d831ec7"; // Example USDT Address (Ethereum mainnet)

  beforeEach(async function () {
    // Get signers
    [owner, user] = await ethers.getSigners();

    // Deploy the Wallet contract
    const walletContractFactory = await ethers.getContractFactory("Wallet");
    wallet = await walletContractFactory.deploy(
      "0x7a250d5630b4cf539739df2c5dacf5c4cfae4dfc", // Uniswap Router address on Ethereum
      JLT_ADDRESS,
      USDT_ADDRESS
    );

    // Connect to the token contracts
    jltToken = await ethers.getContractAt("IERC20", JLT_ADDRESS);
    usdtToken = await ethers.getContractAt("IERC20", USDT_ADDRESS);

    // Mint some tokens for the test
    const mintAmount = ethers.parseUnits("1000", 18); // Mint 1000 tokens for testing

    // Transfer tokens to the user
    await jltToken.transfer(user.address, mintAmount);
    await usdtToken.transfer(user.address, mintAmount);
  });

  it("should allow swapping JLT for USDT", async function () {
    const jltAmount = ethers.parseUnits("100", 18); // Amount to swap

    // Approve the Wallet contract to spend JLT tokens on behalf of the user
    await jltToken.connect(user).approve(wallet.target, jltAmount);

    // Check user balance before the swap
    const userJLTBefore = await jltToken.balanceOf(user.address);
    const userUSDTBefore = await usdtToken.balanceOf(user.address);

    // Swap JLT for USDT
    await wallet.connect(user).swapJLTForUSDT(jltAmount);

    // Check user balance after the swap
    const userJLTAfter = await jltToken.balanceOf(user.address);
    const userUSDTAfter = await usdtToken.balanceOf(user.address);

    // Assert balances have changed
    // expect(userJLTAfter).to.equal(userJLTBefore.sub(jltAmount));
    expect(userUSDTAfter).to.be.gt(userUSDTBefore); // The USDT balance should increase
  });

  it("should allow swapping USDT for JLT", async function () {
    const usdtAmount = ethers.parseUnits("100", 18); // Amount to swap

    // Approve the Wallet contract to spend USDT tokens on behalf of the user
    await usdtToken.connect(user).approve(wallet.target, usdtAmount);

    // Check user balance before the swap
    const userJLTBefore = await jltToken.balanceOf(user.address);
    const userUSDTBefore = await usdtToken.balanceOf(user.address);

    // Swap USDT for JLT
    await wallet.connect(user).swapUSDTForJLT(usdtAmount);

    // Check user balance after the swap
    const userJLTAfter = await jltToken.balanceOf(user.address);
    const userUSDTAfter = await usdtToken.balanceOf(user.address);

    // Assert balances have changed
    expect(userJLTAfter).to.be.gt(userJLTBefore); // The JLT balance should increase
    // expect(userUSDTAfter).to.equal(userUSDTBefore.sub(usdtAmount));
  });

  it("should revert if there is not enough JLT for the swap", async function () {
    const jltAmount = ethers.parseUnits("100000", 18); // Too much JLT for the user

    // Approve the Wallet contract to spend JLT tokens on behalf of the user
    await jltToken.connect(user).approve(wallet.target, jltAmount);

    // Try to swap and expect a revert
    await expect(
      wallet.connect(user).swapJLTForUSDT(jltAmount)
    ).to.be.revertedWith("Insufficient JLT balance");
  });

  it("should revert if there is not enough USDT for the swap", async function () {
    const usdtAmount = ethers.parseUnits("100000", 18); // Too much USDT for the user

    // Approve the Wallet contract to spend USDT tokens on behalf of the user
    await usdtToken.connect(user).approve(wallet.target, usdtAmount);

    // Try to swap and expect a revert
    await expect(
      wallet.connect(user).swapUSDTForJLT(usdtAmount)
    ).to.be.revertedWith("Insufficient USDT balance");
  });
});
