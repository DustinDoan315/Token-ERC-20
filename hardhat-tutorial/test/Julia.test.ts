import { expect } from "chai";
import { ethers } from "hardhat";
import { Signer, Contract, BigNumberish } from "ethers";

describe("Julia Token", function () {
  let juliaToken: any;
  let owner: Signer;
  let addr1: Signer;
  let addr2: Signer;

  beforeEach(async function () {
    // Get the accounts
    [owner, addr1, addr2] = await ethers.getSigners();

    // Deploy the contract
    const TokenFactory = await ethers.getContractFactory("Julia");
    juliaToken = (await TokenFactory.deploy()) as any;
  });

  const cap: BigNumberish = ethers.parseUnits("5000", 18);
  const mintAmount: BigNumberish = ethers.parseUnits("100", 18);
  const transferAmount: BigNumberish = ethers.parseUnits("100", 18);
  const burnAmount: BigNumberish = ethers.parseUnits("100", 18);

  describe("Initialization", function () {
    it("Should have the correct name and symbol", async function () {
      expect(await juliaToken.name()).to.equal("Julia Token");
      expect(await juliaToken.symbol()).to.equal("JLT");
    });

    it("Should assign the total supply to the owner", async function () {
      expect(await juliaToken.balanceOf(await owner.getAddress())).to.equal(
        cap
      );
    });
  });

  describe("Minting", function () {
    // it("Should allow the owner to mint new tokens", async function () {
    //   await juliaToken.mint(await addr1.getAddress(), mintAmount);
    //   expect(await juliaToken.balanceOf(await addr1.getAddress())).to.equal(
    //     mintAmount
    //   );
    // });

    it("Should revert if a non-owner tries to mint", async function () {
      await expect(
        juliaToken.connect(addr1).mint(await addr1.getAddress(), mintAmount)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("Should not allow minting beyond the cap", async function () {
      const mintAmount: BigNumberish = ethers.parseUnits("1", 18);
      await expect(
        juliaToken.mint(await owner.getAddress(), mintAmount)
      ).to.be.revertedWith("Exceeds max supply");
    });
  });

  describe("Burning", function () {
    it("Should allow burning tokens", async function () {
      await juliaToken.connect(owner).burn(burnAmount);
      expect(await juliaToken.balanceOf(await owner.getAddress())).to.equal(
        cap - burnAmount
      );
    });

    it("Should update the total supply after burning", async function () {
      await juliaToken.connect(owner).burn(burnAmount);
      const newSupply = await juliaToken.totalSupply();
      expect(newSupply).to.equal(cap - burnAmount);
    });
  });

  describe("Transfers", function () {
    it("Should prevent transfers if it exceeds the cap", async function () {
      await expect(
        juliaToken.mint(await addr1.getAddress(), mintAmount)
      ).to.be.revertedWith("Exceeds max supply");
    });

    it("Should allow transfers within the cap", async function () {
      await juliaToken
        .connect(owner)
        .transfer(await addr1.getAddress(), transferAmount);
      expect(await juliaToken.balanceOf(await addr1.getAddress())).to.equal(
        transferAmount
      );
    });
  });

  describe("getBalance", function () {
    it("Should return the correct balance", async function () {
      const balance = await juliaToken.getBalance(await owner.getAddress());
      expect(balance).to.equal(cap);
    });
  });
});
