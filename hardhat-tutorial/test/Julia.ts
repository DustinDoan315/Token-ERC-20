import { ethers } from "hardhat";
import { expect } from "chai";
import { Signer } from "ethers";
// import { Julia, Julia__factory } from "../typechain-types";

describe("Julia", function () {
  let owner: Signer;
  let addr1: Signer;
  let addr2: Signer;
  let juliaContract: any;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();

    const JuliaFactory = await ethers.getContractFactory("Julia");
    juliaContract = await JuliaFactory.deploy();
    // await juliaContract.deployed();
  });

  it("Should return the correct name and symbol", async function () {
    expect(await juliaContract.name()).to.equal("Julia");
    expect(await juliaContract.symbol()).to.equal("DTC");
  });

  it("Should mint initial supply to the owner", async function () {
    const ownerBalance = await juliaContract.balanceOf(
      await owner.getAddress()
    );
    expect(ownerBalance).to.equal(50000 * 10 ** 18);
  });

  it("Should transfer tokens between accounts", async function () {
    await juliaContract.transfer(await addr1.getAddress(), 1000);
    const addr1Balance = await juliaContract.balanceOf(
      await addr1.getAddress()
    );
    expect(addr1Balance).to.equal(1000);

    await juliaContract.connect(addr1).transfer(await addr2.getAddress(), 200);
    const addr2Balance = await juliaContract.balanceOf(
      await addr2.getAddress()
    );
    expect(addr2Balance).to.equal(200);
  });

  it("Should not allow transfer more than balance", async function () {
    await expect(
      juliaContract.transfer(await addr1.getAddress(), 100000000)
    ).to.be.revertedWith("ERC20: transfer amount exceeds balance");
  });

  it("Should burn tokens", async function () {
    await juliaContract.burn(1000);
    const ownerBalance = await juliaContract.balanceOf(
      await owner.getAddress()
    );
    expect(ownerBalance).to.equal(49999 * 10 ** 18);
  });

  it("Should not allow burning more than balance", async function () {
    await expect(juliaContract.burn(100000000)).to.be.revertedWith(
      "ERC20: burn amount exceeds balance"
    );
  });

  it("Should allow only owner to burn tokens", async function () {
    await expect(juliaContract.connect(addr1).burn(1000)).to.be.revertedWith(
      "Ownable: caller is not the owner"
    );
  });

  //   it("Should allow getting balance", async function () {
  //     const ownerBalance = await juliaContract.getBalance(
  //       await owner.getAddress()
  //     );
  //     expect(ownerBalance).to.equal(50000 * 10 ** 18);
  //   });
});
