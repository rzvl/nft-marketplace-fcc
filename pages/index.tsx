import Head from "next/head"
import { Inter } from "@next/font/google"
import { useMoralis, useMoralisQuery } from "react-moralis"
import { Loading } from "@web3uikit/core"
import NFTBox from "../components/NFTBox"
import { useState } from "react"
import UpdateListingModal from "../components/UpdateListingModal"

const inter = Inter({ subsets: ["latin"] })

export default function Home() {
    const [showModal, setShowModal] = useState(false)
    const [modalTokenId, setModalTokenId] = useState("")
    const [modalNftAddress, setModalNftAddress] = useState("")
    const [modalMarketplaceAddress, setModalMarketplaceAddress] = useState("")

    const { isWeb3Enabled } = useMoralis()
    const { data: listedNfts, isFetching: fetchingListedNfts } = useMoralisQuery(
        "ActiveItem",
        (query) => query.limit(10).descending("tokenId")
    )

    function ownerCardClick(tokenId: string, nftAddress: string, marketplaceAddress: string) {
        setModalTokenId(tokenId)
        setModalNftAddress(nftAddress)
        setModalMarketplaceAddress(marketplaceAddress)
        setShowModal(true)
    }

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
                        fetchingListedNfts ? (
                            <div>Loading</div>
                        ) : (
                            listedNfts.map((nft) => {
                                const { nftAddress, tokenId, price, marketplaceAddress, seller } =
                                    nft.attributes
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
