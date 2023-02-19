const Moralis = require("moralis").default
require("dotenv").config()
const {
    itemListedOptions,
    itemCanceledOptions,
    itemBoughtOptions,
} = require("./helper-moralis-config")

const MORALIS_API_KEY = process.env.MORALIS_API_KEY

Moralis.start({
    apiKey: MORALIS_API_KEY,
})

addStream(itemListedOptions)
addStream(itemCanceledOptions)
addStream(itemBoughtOptions)

async function addStream(options) {
    const stream = await Moralis.Streams.add(options)
    const { id } = stream.toJSON()
    const address = "0x7a1587243C25Ad8026601338e4fAc39ca8df683d"
    await Moralis.Streams.addAddress({ address, id })
}
