import { Address, BigInt } from "@graphprotocol/graph-ts"
import {
    ItemBought as ItemBoughtEvent,
    ItemCanceled as ItemCanceledEvent,
    ItemListed as ItemListedEvent,
} from "../generated/NftMarketplace/NftMarketplace"
import {
    ActiveItem,
    ItemBought,
    ItemCanceled,
    ItemListed,
} from "../generated/schema"

export function handleItemBought(event: ItemBoughtEvent): void {
    let itemBought = new ItemBought(
        event.transaction.hash.concatI32(event.logIndex.toI32())
    )
    itemBought.buyer = event.params.buyer
    itemBought.nftAddress = event.params.nftAddress
    itemBought.tokenId = event.params.tokenId
    itemBought.price = event.params.price

    itemBought.blockNumber = event.block.number
    itemBought.blockTimestamp = event.block.timestamp
    itemBought.transactionHash = event.transaction.hash

    itemBought.save()

    let id = getIdFromEventParams(event.params.tokenId, event.params.nftAddress)
    let activeItem = ActiveItem.load(id)

    activeItem!.buyer = event.params.buyer
    activeItem!.save()
}

export function handleItemCanceled(event: ItemCanceledEvent): void {
    let itemCanceled = new ItemCanceled(
        event.transaction.hash.concatI32(event.logIndex.toI32())
    )
    itemCanceled.seller = event.params.seller
    itemCanceled.nftAddress = event.params.nftAddress
    itemCanceled.tokenId = event.params.tokenId

    itemCanceled.blockNumber = event.block.number
    itemCanceled.blockTimestamp = event.block.timestamp
    itemCanceled.transactionHash = event.transaction.hash

    itemCanceled.save()

    let id = getIdFromEventParams(event.params.tokenId, event.params.nftAddress)
    let activeItem = ActiveItem.load(id)
    activeItem!.buyer = Address.fromString(
        "0x000000000000000000000000000000000000dEaD"
    )
    activeItem!.save()
}

export function handleItemListed(event: ItemListedEvent): void {
    let itemListed = new ItemListed(
        event.transaction.hash.concatI32(event.logIndex.toI32())
    )
    itemListed.seller = event.params.seller
    itemListed.nftAddress = event.params.nftAddress
    itemListed.tokenId = event.params.tokenId
    itemListed.price = event.params.price

    itemListed.blockNumber = event.block.number
    itemListed.blockTimestamp = event.block.timestamp
    itemListed.transactionHash = event.transaction.hash

    itemListed.save()

    let id = getIdFromEventParams(event.params.tokenId, event.params.nftAddress)
    let activeItem = ActiveItem.load(id)
    if (!activeItem) {
        activeItem = new ActiveItem(id)
    }

    activeItem.seller = event.params.seller
    activeItem.nftAddress = event.params.nftAddress
    activeItem.tokenId = event.params.tokenId
    activeItem.price = event.params.price
    activeItem.buyer = Address.fromString(
        "0x0000000000000000000000000000000000000000"
    )

    activeItem.save()
}

function getIdFromEventParams(tokenId: BigInt, nftAddress: Address): string {
    return tokenId.toHexString() + nftAddress.toHexString()
}
