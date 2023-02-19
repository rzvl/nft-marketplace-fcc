import "../styles/globals.css"
import type { AppProps } from "next/app"
import Header from "../components/Header"
import { MoralisProvider } from "react-moralis"
import { NotificationProvider } from "@web3uikit/core"
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client"

const client = new ApolloClient({
    uri: "https://api.studio.thegraph.com/query/40770/nft-marketplace-subgraph/v0.0.1",
    cache: new InMemoryCache(),
})

export default function App({ Component, pageProps }: AppProps) {
    return (
        <MoralisProvider initializeOnMount={false}>
            <ApolloProvider client={client}>
                <NotificationProvider>
                    <Header />
                    <Component {...pageProps} />
                </NotificationProvider>
            </ApolloProvider>
        </MoralisProvider>
    )
}
