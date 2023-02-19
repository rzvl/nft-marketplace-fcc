const { EvmChain } = require("@moralisweb3/common-evm-utils")

const itemListedAbi = {
    anonymous: false,
    inputs: [
        {
            indexed: true,
            internalType: "address",
            name: "seller",
            type: "address",
        },
        {
            indexed: true,
            internalType: "address",
            name: "nftAddress",
            type: "address",
        },
        {
            indexed: true,
            internalType: "uint256",
            name: "tokenId",
            type: "uint256",
        },
        {
            indexed: false,
            internalType: "uint256",
            name: "price",
            type: "uint256",
        },
    ],
    name: "ItemListed",
    type: "event",
}

const itemCanceledAbi = {
    anonymous: false,
    inputs: [
        {
            indexed: true,
            internalType: "address",
            name: "seller",
            type: "address",
        },
        {
            indexed: true,
            internalType: "address",
            name: "nftAddress",
            type: "address",
        },
        {
            indexed: true,
            internalType: "uint256",
            name: "tokenId",
            type: "uint256",
        },
    ],
    name: "ItemCanceled",
    type: "event",
}

const itemBoughtAbi = {
    anonymous: false,
    inputs: [
        {
            indexed: true,
            internalType: "address",
            name: "buyer",
            type: "address",
        },
        {
            indexed: true,
            internalType: "address",
            name: "nftAddress",
            type: "address",
        },
        {
            indexed: true,
            internalType: "uint256",
            name: "tokenId",
            type: "uint256",
        },
        {
            indexed: false,
            internalType: "uint256",
            name: "price",
            type: "uint256",
        },
    ],
    name: "ItemBought",
    type: "event",
}

const webhookUrl = "https://648d-79-141-164-223.ngrok.io/streams"

const itemListedOptions = {
    chains: [EvmChain.GOERLI],
    description: "List an NFT item",
    tag: "itemlisted",
    includeContractLogs: true,
    abi: itemListedAbi,
    topic0: ["ItemListed(address,address,uint256,uint256)"],
    webhookUrl: webhookUrl,
}

const itemCanceledOptions = {
    chains: [EvmChain.GOERLI],
    description: "Cancle listing of an item",
    tag: "itemcanceled",
    includeContractLogs: true,
    abi: itemCanceledAbi,
    topic0: ["ItemCanceled(address,address,uint256)"],
    webhookUrl: webhookUrl,
}

const itemBoughtOptions = {
    chains: [EvmChain.GOERLI],
    description: "Buy a listed item",
    tag: "itembought",
    includeContractLogs: true,
    abi: itemBoughtAbi,
    topic0: ["ItemBought(address,address,uint256,uint256)"],
    webhookUrl: webhookUrl,
}

module.exports = {
    itemListedOptions,
    itemCanceledOptions,
    itemBoughtOptions,
}
