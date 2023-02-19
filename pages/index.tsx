import Head from "next/head"
import { useMoralis } from "react-moralis"
import { Loading } from "@web3uikit/core"
import NFTBox from "../components/NFTBox"
import { useState } from "react"
import UpdateListingModal from "../components/UpdateListingModal"
import GET_ACTIVE_ITEMS from "../constants/subgraphQueries"
import { useQuery } from "@apollo/client"

export default function Home() {
    const [showModal, setShowModal] = useState(false)
    const [modalTokenId, setModalTokenId] = useState("")
    const [modalNftAddress, setModalNftAddress] = useState("")
    const [modalMarketplaceAddress, setModalMarketplaceAddress] = useState("")

    const { isWeb3Enabled } = useMoralis()

    const marketplaceAddress = "0x7a1587243C25Ad8026601338e4fAc39ca8df683d"

    function ownerCardClick(tokenId: string, nftAddress: string, marketplaceAddress: string) {
        setModalTokenId(tokenId)
        setModalNftAddress(nftAddress)
        setModalMarketplaceAddress(marketplaceAddress)
        setShowModal(true)
    }

    const { loading, error, data: listedNfts } = useQuery(GET_ACTIVE_ITEMS)

    return (
        <>
            <Head>
                <title>NFT Marketplace</title>
                <meta name="description" content="Home Page of the Best NFT Marketplace!" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className="container mx-auto">
                <h1 className="py-4 px-4 font-bold text-2xl">Recently Listed</h1>
                <div className="flex flex-wrap">
                    {isWeb3Enabled ? (
                        loading || !listedNfts ? (
                            <div>Loading</div>
                        ) : (
                            listedNfts.activeItems.map((nft: any) => {
                                const { nftAddress, tokenId, price, seller } = nft
                                return (
                                    <div key={nftAddress + tokenId}>
                                        <NFTBox
                                            nftAddress={nftAddress}
                                            tokenId={tokenId}
                                            price={price}
                                            seller={seller}
                                            marketplaceAddress={marketplaceAddress}
                                            ownerCardClick={ownerCardClick}
                                        />
                                    </div>
                                )
                            })
                        )
                    ) : (
                        <div>Web3 Currently Not Enabled</div>
                    )}
                </div>
            </main>
            <UpdateListingModal
                nftAddress={modalNftAddress}
                tokenId={modalTokenId}
                isVisible={showModal}
                marketplaceAddress={modalMarketplaceAddress}
                setShowModal={setShowModal}
            />
        </>
    )
}
