const { expect } = require("chai");
const hre = require("hardhat");
const helpers = require("@nomicfoundation/hardhat-network-helpers");

describe("degen", function () {
  let degen;
  let owner;
  let user;
  let signedUser;
  const amount = hre.ethers.utils.parseEther("10");
  beforeEach(async function () {
    [{ address: owner }, { address: user }] = await hre.ethers.getSigners();
    const Degen = await hre.ethers.getContractFactory("DegenToken");
    degen = await Degen.deploy();
    signedUser = await hre.ethers.getImpersonatedSigner(user);
    await degen.mint(owner, 10000);
  });

  it("should mint", async function () {
    await degen.mint(user, amount);
    expect(await degen.balanceOf(user)).to.equal(amount);
  });

  it("should burn", async function () {
    await degen.mint(user, amount);
    await degen.connect(signedUser).burn(hre.ethers.utils.parseEther("3"));
    expect(await degen.balanceOf(user)).to.equal(
      hre.ethers.utils.parseEther("7")
    );
  });

  it("should transfer", async function () {
    await degen.transfer(user, 5000);
    expect(await degen.balanceOf(user)).to.equal(5000);
  });

  it("should create item", async function () {
    await degen.addToMarket("NFT", hre.ethers.utils.parseEther("2"));
    const t = await degen.marketItems(1);
    expect(hre.ethers.utils.formatEther(t.price)).to.equal("2.0");
  });

  it("should redeem item", async function () {
    await degen.mint(user, amount);
    await degen.addToMarket("NFT", hre.ethers.utils.parseEther("2"));
    await degen.connect(signedUser).redeem(1);
    expect(await degen.balanceOf(user)).to.equal(
      hre.ethers.utils.parseEther("8")
    );
    const t = await degen.marketItems(1);
    expect(t.itemOwner).to.equal(user);
  });
});
