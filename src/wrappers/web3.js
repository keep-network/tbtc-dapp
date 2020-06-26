import React, { Component, useEffect, useState } from 'react'
import Web3 from 'web3'
import TBTC from '@keep-network/tbtc.js'
import { Web3ReactProvider, useWeb3React } from '@web3-react/core'

import config from '../config/config.json'

/**
 * @typedef {Object} Deferred
 * @property {(value) => void} resolve - A function to resolve the promise.
 * @property {(error) => void} reject - A function to reject the promise.
 * @property {Promise} promise - The promise whose resolution is deferred.
 */
/**
 * Deferred is a Promise that can be resolved,
 * at a later point in time.
 * @return {Deferred} A deferred promise.
 */
function Deferred() {
    let resolve
    let reject

    const promise = new Promise((res, rej) => {
        resolve = res
        reject = rej
    })

    return {
        promise,
        reject,
        resolve
    }
}

let Web3LoadedDeferred = new Deferred()
let TBTCLoadedDeferred = new Deferred()

export let Web3Loaded = Web3LoadedDeferred.promise
export let TBTCLoaded = TBTCLoadedDeferred.promise

const initializeContracts = async (web3, connector) => {
    // Initialise default account.
    console.log("connector", await connector.getAccount())
    web3.eth.defaultAccount = await connector.getAccount()

    // Log the netId/chainId.
    const netId = await web3.eth.net.getId()
    const chainId = await web3.eth.getChainId()
    console.debug(`netId: ${netId}\nchainId: ${chainId}`)

    Web3LoadedDeferred.resolve(web3)
    
    const tbtc = await TBTC.withConfig({
        web3: web3,
        bitcoinNetwork: "testnet",
        electrum: config.electrum
    })

    TBTCLoadedDeferred.resolve(tbtc)
}

function instantiateWeb3(provider, connector) {
    return new Web3(provider)
}

const Web3ReactManager = ({ children }) => {
    const { activate, active, library, connector } = useWeb3React()

    useEffect(() => {
        if(active) {
            initializeContracts(library, connector)
        }
    }, [library, connector, active])

    // Watch for changes:
    // provider = this.state.web3.eth.currentProvider
    // provider.on('networkChanged', this.getAndSetAccountInfo)
    // provider.on('accountsChanged', this.getAndSetAccountInfo)

    return children
}

const Web3Wrapper = ({ children }) => {
    return <Web3ReactProvider getLibrary={instantiateWeb3}>
        <Web3ReactManager>
            {children}
        </Web3ReactManager>
    </Web3ReactProvider>
}

export default Web3Wrapper
