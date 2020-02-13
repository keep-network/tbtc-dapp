import React, { Component } from 'react';
import NewsItem from "./NewsItem"

export default () => {
    let data = {
        title: "tBTC on Ropsten",
        date: '02.12.2020',
        body: `
        tBTC is Open-Source and Live on Ropsten

        The first release of tBTC is now live on Ropsten, the public Ethereum testnet.

        To try minting your first TBTC, visit the
        <a href="htps://dapp.test.tbtc.network">reference dApp</a>. Make sure
        you're loaded up on testnet bitcoin and Ropsten ether, and you can be
        the first TBTC whale :sunglasses_emoji:

        While the code undergoes audit and further testing, development is
        now <a href="https://github.com/keep-network/tbtc">public on GitHub</a>.
        That means you can begin building Bitcoin experiences on DeFi apps
        like Compound and Uniswap, today. To learn more about this release,
        you can:

        -> <a href="http://docs.keep.network/tbtc/index.pdf">Read the latest spec</a>

        -> <a href="https://github.com/keep-network/tbtc/implementation">Browse the source code</a>

        -> <a href="https://dapp.test.tbtc.network/">Play with the dApp</a>

        -> <a href="https://www.npmjs.com/package/@keep-network/tbtc.js">Build on testnet (NPM)</a>
        `
    }
    return <NewsItem {...data}/>
}
