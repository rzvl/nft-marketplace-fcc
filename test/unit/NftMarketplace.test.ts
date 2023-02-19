import { deployments, ethers, network } from "hardhat"
import { NftMarketplace, BasicNft } from "../../typechain-types"
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers"
import { developmentChains } from "../../helper-hardhat-config"
import { expect } from "chai"

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("NFT Marketplace Unit Tests", function () {
          async function deployNftMarketplaceFixture() {
              const [seller, buyer] = await ethers.getSigners()
              await deployments.fixture(["nftmarketplace", "basicnft"])
              const nftMarketplace: NftMarketplace = await ethers.getContract("NftMarketplace")
              const basicNft: BasicNft = await ethers.getContract("BasicNft")
              const nftMintTxResponse = await basicNft.mintNft()
              await nftMintTxResponse.wait(1)
              await basicNft.approve(nftMarketplace.address, 0)
              const price = ethers.utils.parseEther("1")
              return { seller, buyer, nftMarketplace, basicNft, price }
          }
          describe("listItem", function () {
              it("reverts if the token is already listed", async function () {
                  const { nftMarketplace, basicNft, price } = await loadFixture(
                      deployNftMarketplaceFixture
                  )
                  nftMarketplace.listItem(basicNft.address, 0, price)
                  await expect(
                      nftMarketplace.listItem(basicNft.address, 0, price)
                  ).to.be.revertedWithCustomError(nftMarketplace, "AlreadyListed")
              })
              it("reverts if caller is not the owner of NFT", async function () {
                  const { buyer, nftMarketplace, basicNft, price } = await loadFixture(
                      deployNftMarketplaceFixture
                  )
                  const nftMarketplaceWithBuyer = nftMarketplace.connect(buyer)
                  await expect(
                      nftMarketplaceWithBuyer.listItem(basicNft.address, 0, price)
                  ).to.be.revertedWithCustomError(nftMarketplaceWithBuyer, "NotOwner")
              })
              it("reverts if price is zero", async function () {
                  const { nftMarketplace, basicNft } = await loadFixture(
                      deployNftMarketplaceFixture
                  )
                  await expect(
                      nftMarketplace.listItem(basicNft.address, 0, 0)
                  ).to.be.revertedWithCustomError(nftMarketplace, "PriceMustBeAboveZero")
              })
              it("reverts if Basic Nft contract do not approve NFT Marketplace contract", async function () {
                  const { nftMarketplace, basicNft, price } = await loadFixture(
                      deployNftMarketplaceFixture
                  )
                  const nftMintTxResponse = await basicNft.mintNft()
                  await nftMintTxResponse.wait(1)
                  await expect(
                      nftMarketplace.listItem(basicNft.address, 1, price)
                  ).to.be.revertedWithCustomError(nftMarketplace, "NotApprovedForMarketplace")
              })
              it("lists the NFT successfully and emits an event", async function () {
                  const { seller, nftMarketplace, basicNft, price } = await loadFixture(
                      deployNftMarketplaceFixture
                  )
                  await expect(nftMarketplace.listItem(basicNft.address, 0, price))
                      .to.emit(nftMarketplace, "ItemListed")
                      .withArgs(seller.address, basicNft.address, 0, price)
                  const listing = await nftMarketplace.getListing(basicNft.address, 0)
                  expect(listing.price).to.equal(price)
                  expect(listing.seller).to.equal(seller.address)
              })
          })
          describe("buyItem", function () {
              it("reverts if NFT is not listed", async function () {
                  const { nftMarketplace, basicNft } = await loadFixture(
                      deployNftMarketplaceFixture
                  )
                  await expect(
                      nftMarketplace.buyItem(basicNft.address, 0)
                  ).to.be.revertedWithCustomError(nftMarketplace, "NotListed")
              })
              it("reverts if price is not met", async function () {
                  const { buyer, nftMarketplace, basicNft, price } = await loadFixture(
                      deployNftMarketplaceFixture
                  )
                  const txResponse = await nftMarketplace.listItem(basicNft.address, 0, price)
                  await txResponse.wait(1)
                  const nftMarketplaceWithBuyer: NftMarketplace = nftMarketplace.connect(buyer)
                  await expect(
                      nftMarketplaceWithBuyer.buyItem(basicNft.address, 0)
                  ).to.be.revertedWithCustomError(nftMarketplace, "PriceNotMet")
              })
              it("transfers the NFT successfully and emits an event", async function () {
                  const { seller, buyer, nftMarketplace, basicNft, price } = await loadFixture(
                      deployNftMarketplaceFixture
                  )
                  const listItemTxResponse = await nftMarketplace.listItem(
                      basicNft.address,
                      0,
                      price
                  )
                  await listItemTxResponse.wait(1)
                  const nftMarketplaceWithBuyer: NftMarketplace = nftMarketplace.connect(buyer)
                  await expect(
                      nftMarketplaceWithBuyer.buyItem(basicNft.address, 0, {
                          value: price,
                      })
                  )
                      .to.emit(nftMarketplaceWithBuyer, "ItemBought")
                      .withArgs(buyer.address, basicNft.address, 0, price)
                  const listing = await nftMarketplace.getListing(basicNft.address, 0)
                  expect(await nftMarketplace.getProceeds(seller.address)).to.equal(price)
                  expect(listing.price).to.equal(0)
                  expect(await basicNft.ownerOf(0)).to.equal(buyer.address)
              })
          })
          describe("cancelListing", function () {
              it("cancels the listing and emits an event", async function () {
                  const { seller, nftMarketplace, basicNft, price } = await loadFixture(
                      deployNftMarketplaceFixture
                  )
                  const listItemTxResponse = await nftMarketplace.listItem(
                      basicNft.address,
                      0,
                      price
                  )
                  await listItemTxResponse.wait(1)
                  await expect(nftMarketplace.cancelListing(basicNft.address, 0))
                      .to.emit(nftMarketplace, "ItemCanceled")
                      .withArgs(seller.address, basicNft.address, 0)
                  const listing = await nftMarketplace.getListing(basicNft.address, 0)
                  expect(listing.price).to.equal(0)
              })
          })
          describe("uplateListing", function () {
              it("update the price of the listing and emits an event", async function () {
                  const { seller, nftMarketplace, basicNft, price } = await loadFixture(
                      deployNftMarketplaceFixture
                  )
                  const listItemTxResponse = await nftMarketplace.listItem(
                      basicNft.address,
                      0,
                      price
                  )
                  await listItemTxResponse.wait(1)
                  const newPrice = ethers.utils.parseEther("1.5")
                  await expect(nftMarketplace.updateListing(basicNft.address, 0, newPrice))
                      .to.emit(nftMarketplace, "ItemListed")
                      .withArgs(seller.address, basicNft.address, 0, newPrice)
                  const listing = await nftMarketplace.getListing(basicNft.address, 0)
                  expect(listing.price).to.equal(newPrice)
              })
          })
          describe("withdrawProceeds", function () {
              it("reverts if proceeds is zero", async function () {
                  const { nftMarketplace } = await loadFixture(deployNftMarketplaceFixture)
                  await expect(nftMarketplace.withdrawProceeds()).to.be.revertedWithCustomError(
                      nftMarketplace,
                      "NoProceeds"
                  )
              })
              it("withdraws proceeds", async function () {
                  const { seller, buyer, nftMarketplace, basicNft, price } = await loadFixture(
                      deployNftMarketplaceFixture
                  )
                  const listItemTxResponse = await nftMarketplace.listItem(
                      basicNft.address,
                      0,
                      price
                  )
                  await listItemTxResponse.wait(1)
                  const nftMarketplaceWithBuyer: NftMarketplace = nftMarketplace.connect(buyer)
                  const buyItemTxResponse = await nftMarketplaceWithBuyer.buyItem(
                      basicNft.address,
                      0,
                      {
                          value: price,
                      }
                  )
                  await buyItemTxResponse.wait(1)
                  const sellerBalance = await seller.getBalance()
                  const withdrawProceedsTxResponse = await nftMarketplace.withdrawProceeds()
                  const withdrawProceedsTxReceipt = await withdrawProceedsTxResponse.wait(1)
                  const { gasUsed, effectiveGasPrice } = withdrawProceedsTxReceipt
                  const gasCost = gasUsed.mul(effectiveGasPrice)
                  expect(await nftMarketplace.getProceeds(seller.address)).to.equal(0)
                  expect(await seller.getBalance()).to.equal(sellerBalance.add(price).sub(gasCost))
              })
          })
      })
