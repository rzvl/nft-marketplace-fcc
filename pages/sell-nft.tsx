import Head from "next/head"
import { Form, useNotification } from "@web3uikit/core"
import { ethers } from "ethers"
import bascicNftAbi from "../constants/BasicNftAbi.json"
import nftMarketplaceAbi from "../constants/NftMarketplaceAbi.json"
import { useWeb3Contract } from "react-moralis"

export default function SellNft() {
    const nftMarketplaceAddress = "0x7a1587243C25Ad8026601338e4fAc39ca8df683d"

    // @ts-ignore
    const { runContractFunction } = useWeb3Contract()

    async function approveAndList(data: any) {
        console.log("Approving...")
        const nftAddress = data.data[0].inputResult
        const tokenId = data.data[1].inputResult
        const price = ethers.utils.parseEther(data.data[2].inputResult).toString()
        const approveOptions = {
            abi: bascicNftAbi,
            contractAddress: nftAddress,
            functionName: "approve",
            params: {
                to: nftMarketplaceAddress,
                tokenId: tokenId,
            },
        }
        await runContractFunction({
            params: approveOptions,
            onError: (error) => console.log(error),
            onSuccess: () => handleApproveSuccess(nftAddress, tokenId, price),
        })
    }

    async function handleApproveSuccess(nftAddress: string, tokenId: string, price: string) {
        console.log("OK! Now time to list...")
        const listOptions = {
            abi: nftMarketplaceAbi,
            contractAddress: nftMarketplaceAddress,
            functionName: "listItem",
            params: {
                nftAddress: nftAddress,
                tokenId: tokenId,
                price: price,
            },
        }
        await runContractFunction({
            params: listOptions,
            onError: (error) => console.log(error),
            onSuccess: () => handleListSuccess(),
        })
    }

    const dispatch = useNotification()

    async function handleListSuccess() {
        dispatch({
            type: "success",
            message: "Item Listed!",
            title: "Your NFT was listed successfully!",
            position: "topR",
        })
    }

    return (
        <>
            <Head>
                <title>Sell NFTs</title>
                <meta name="description" content="List your NFTs for sale!" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main>
                <Form
                    title="Sell Your NFT!"
                    id="Main Form"
                    onSubmit={approveAndList}
                    data={[
                        {
                            name: "NFT Address",
                            type: "text",
                            inputWidth: "50%",
                            value: "",
                            key: "nftAddress",
                        },
                        {
                            name: "Token Id",
                            type: "number",
                            inputWidth: "50%",
                            value: "",
                            key: "tokenId",
                        },
                        {
                            name: "Price (in ETH)",
                            type: "number",
                            inputWidth: "50%",
                            value: "",
                            key: "price",
                        },
                    ]}
                />
            </main>
        </>
    )
}
