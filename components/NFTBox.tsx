import { useEffect, useState, Dispatch, SetStateAction } from "react"
import { useMoralis, useWeb3Contract } from "react-moralis"
import bascicNftAbi from "../constants/BasicNftAbi.json"
import nftMarketplaceAbi from "../constants/NftMarketplaceAbi.json"
import Image from "next/image"
import { Card, useNotification } from "@web3uikit/core"
import { ethers } from "ethers"

interface NFTBoxProps {
    price: number
    nftAddress: string
    tokenId: string
    seller: string
    marketplaceAddress: string
    ownerCardClick: (tokenId: string, nftAddress: string, marketplaceAddress: string) => void
}

function truncateStr(fullStr: string, strLength: number) {
    if (fullStr.length <= strLength) fullStr
    const seperator = "..."
    const charsToShow = Math.ceil(strLength - seperator.length)
    const frontChars = Math.floor(charsToShow / 2)
    return (
        fullStr.substring(0, frontChars) +
        seperator +
        fullStr.substring(fullStr.length - frontChars)
    )
}

const NFTBox = ({
    price,
    nftAddress,
    tokenId,
    seller,
    marketplaceAddress,
    ownerCardClick,
}: NFTBoxProps) => {
    const [imageURI, setImageURI] = useState("")
    const [tokenName, setTokenName] = useState("")
    const [tokenDescription, setTokenDescription] = useState("")

    const { account, isWeb3Enabled } = useMoralis()

    const { runContractFunction: getTokenURI } = useWeb3Contract({
        abi: bascicNftAbi,
        contractAddress: nftAddress,
        functionName: "tokenURI",
        params: { tokenId: tokenId },
    })

    const { runContractFunction: buyItem } = useWeb3Contract({
        abi: nftMarketplaceAbi,
        contractAddress: marketplaceAddress,
        functionName: "buyItem",
        msgValue: price,
        params: { nftAddress: nftAddress, tokenId: tokenId },
    })

    async function updateUI() {
        const tokenURI = (await getTokenURI()) as string
        const requestURL = tokenURI.replace("ipfs://", "https://ipfs.io/ipfs/")
        const tokenUriResponse = await (await fetch(requestURL)).json()
        const imageURI = tokenUriResponse.image
        const imageUriUrl = imageURI.replace("ipfs://", "https:/ipfs.io/ipfs/")
        setImageURI(imageUriUrl)
        setTokenName(tokenUriResponse.name)
        setTokenDescription(tokenUriResponse.description)
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            updateUI()
        }
    }, [isWeb3Enabled])

    const isOwnedByUser = account === seller || seller === undefined
    const formattedSellerAddress = isOwnedByUser ? "you" : truncateStr(seller, 15)

    function handleCardClick() {
        isOwnedByUser
            ? ownerCardClick(tokenId, nftAddress, marketplaceAddress)
            : buyItem({ onError: (error) => console.log(error), onSuccess: handleBuyItemSuccess })
    }

    const dispatch = useNotification()
    async function handleBuyItemSuccess(tx: any) {
        await tx.wait(1)
        dispatch({
            type: "success",
            message: "Item Bought!",
            title: "Item Bought!",
            position: "topR",
        })
    }

    return (
        <Card title={tokenName} description={tokenDescription} onClick={handleCardClick}>
            <div className="p-2">
                <div className="flex flex-col items-end gap-2">
                    <div>#{tokenId}</div>
                    <div className="italic text-sm">Owned by {formattedSellerAddress}</div>
                    <Image
                        loader={() => imageURI}
                        src={imageURI}
                        alt={tokenName}
                        width={200}
                        height={200}
                    />
                    <div className="font-bold">{ethers.utils.formatUnits(price, "ether")} ETH</div>
                </div>
            </div>
        </Card>
    )
}

export default NFTBox
