import { ethers } from "hardhat"
import { NftMarketplace, BasicNft } from "../typechain-types"

async function mintAndList() {
    const nftMarketplace: NftMarketplace = await ethers.getContract("NftMarketplace")
    const basicNft: BasicNft = await ethers.getContract("BasicNft")
    const PRICE = ethers.utils.parseEther("0.1")
    // Minting
    console.log("Minting")
    const mintTx = await basicNft.mintNft()
    const mintTxReceipt = await mintTx.wait(1)
    // @ts-ignore
    const tokenId = mintTxReceipt.events[0].args.tokenId
    // Approving
    console.log("Approving NFT...")
    const approvalTx = await basicNft.approve(nftMarketplace.address, tokenId)
    await approvalTx.wait(1)
    // Listing
    console.log("Listing NFT...")
    const listTx = await nftMarketplace.listItem(basicNft.address, tokenId, PRICE)
    await listTx.wait(1)
    console.log("Listed!")
}

mintAndList().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
