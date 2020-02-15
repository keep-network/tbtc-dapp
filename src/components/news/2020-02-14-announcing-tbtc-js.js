import React, { Component } from 'react';
import NewsItem from "./NewsItem"

export default () => {
    let data = {
        title: "Announcing tbtc.js",
        date: '02.14.2020',
      body: `
        A new library, <a href="https://github.com/keep-network/tbtc.js"><pre>tbtc.js</pre></a>,
        is live on GitHub, representing the easiest, safest way to integrate
        Bitcoin in your Ethereum dApp.

        <pre>tbtc.js</pre> makes it easy for developers to directly integrate
        Bitcoin into their dApps. That means products like
        <a href="https://compound.finance/">Compound</a>,
        <a href="https://fulcrum.trade/">Fulcrum</a>, and
        <a href="https://aave.com/">Aave</a> can build seamless experiences for
        Bitcoin holders to get involved in the DeFi ecosystem.

        The library takes the pain out of building a cross-chain dApp,
        interacting with the Bitcoin network through an Electrum
        client and Ethereum through a standard Web3 provider.

        With <pre>tbtc.js</pre>, you can

        -> <a href="https://github.com/keep-network/tbtc.js#creating-and-funding-a-deposit">Accept Bitcoin deposits in your dApp</a>

        -> Mint TBTC

        -> Transfer and trade TBTC as you would any other ERC-20 token

        -> <a href="https://github.com/keep-network/tbtc.js#redeeming-a-deposit">Redeem users' TBTC for Bitcoin</a>

        ... all without taking custody or changing your tech stack.

        Take the library for a spin on
        <a href="https://github.com/keep-network/tbtc.js">GitHub!</a>
        `
    }
    return <NewsItem {...data}/>
}
