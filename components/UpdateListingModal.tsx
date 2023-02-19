import { Modal, Input, useNotification } from "@web3uikit/core"
import { ethers } from "ethers"
import { useState, Dispatch, SetStateAction } from "react"
import { useWeb3Contract } from "react-moralis"
import nftMarketplaceAbi from "../constants/NftMarketplaceAbi.json"

interface UpdateListingModalProps {
    setShowModal: Dispatch<SetStateAction<boolean>>
    nftAddress: string
    tokenId: string
    isVisible: boolean
    marketplaceAddress: string
}

const UpdateListingModal = ({
    setShowModal,
    nftAddress,
    tokenId,
    isVisible,
    marketplaceAddress,
}: UpdateListingModalProps) => {
    const [priceToUpdateListingWith, setPriceToUpdateListingWith] = useState("0")

    const { runContractFunction: updateListing } = useWeb3Contract({
        abi: nftMarketplaceAbi,
        contractAddress: marketplaceAddress,
        functionName: "updateListing",
        params: {
            nftAddress: nftAddress,
            tokenId: tokenId,
            newPrice: ethers.utils.parseEther(priceToUpdateListingWith || "0"),
        },
    })

    const hideModal = () => setShowModal(false)

    const dispatch = useNotification()

    async function handleUpdateListingSuccess(tx: any) {
        await tx.wait(1)
        dispatch({
            type: "success",
            message: "Listing Updated",
            title: "Listing updated - please refresh (and move blocks)",
            position: "topR",
        })
        isVisible && hideModal()
        setPriceToUpdateListingWith("0")
    }

    return (
        <Modal
            isVisible={isVisible}
            id="regular"
            onCancel={hideModal}
            onCloseButtonPressed={hideModal}
            onOk={() =>
                updateListing({
                    onError: (error) => console.log(error),
                    onSuccess: handleUpdateListingSuccess,
                })
            }
            title={`Update #${tokenId} NFT price`}
        >
            <Input
                label="Update listing price in L1 currency (ETH)"
                name="new listing price"
                type="number"
                onChange={(event) => setPriceToUpdateListingWith(event.target.value)}
            />
        </Modal>
    )
}

export default UpdateListingModal
