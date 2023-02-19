import "../styles/globals.css"
import type { AppProps } from "next/app"
import Header from "../components/Header"
import { MoralisProvider } from "react-moralis"
import { NotificationProvider } from "@web3uikit/core"

const APP_ID = process.env.NEXT_PUBLIC_APPLICATION_ID
const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL

export default function App({ Component, pageProps }: AppProps) {
    return (
        <MoralisProvider appId={APP_ID!} serverUrl={SERVER_URL!}>
            <NotificationProvider>
                <Header />
                <Component {...pageProps} />
            </NotificationProvider>
        </MoralisProvider>
    )
}
