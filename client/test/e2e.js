const rewire = require('rewire')
const proof = rewire('../src/btc/proof')
const {
    watchForTransaction
} = require('../src/btc')
const ElectrumClient = require('tbtc-helpers').ElectrumClient
const config = require('../../src/config/config.json')

const fs = require('fs')
const chai = require('chai')
const assert = chai.assert

import { createDeposit, getDepositBtcAddress, setDefaults, watchForPublicKeyPublished } from '../src'
import { Deposit } from '../src/eth/contracts'
const Web3 = require('web3')

let web3

const CONFIRMATIONS = 6

describe.only('E2E', function() {
    this.timeout(70 * 1000)

  before(async () => {
    // TruffleContract was built to use web3 0.3.0, which uses an API method of `sendAsync`
    // in later versions of web (1.0.0), this method was renamed to `send`
    // This hack makes them work together again.
    // https://github.com/ethereum/web3.js/issues/1119
    Web3.providers.HttpProvider.prototype.sendAsync = Web3.providers.HttpProvider.prototype.send

    web3 = new Web3(new Web3.providers.WebsocketProvider('ws://localhost:8545'))
    await setDefaults(web3)
  })


  it('watchForTransaction', async () => {    
    // const depositAddress = await createDeposit()
    // const deposit = await Deposit.at(depositAddress)

    // expect(await deposit.getCurrentState()).to.eq.BN('1')

    // const event = await watchForPublicKeyPublished(depositAddress)
    // expect(event.returnValues.publicKey).to.not.be.empty

    // const btcAddress = await getDepositBtcAddress(depositAddress)
    // expect(btcAddress.substring(0, 2)).to.equal('tb')


    const electrumClient = new ElectrumClient.Client(config.electrum.localTestnet)
    await electrumClient.connect()

    // Make a transaction.
    let tx = await watchForTransaction(electrumClient, 'mr79t8QXcZKXx8UhQju6GQ1t6tmpRHsX25', 1000)

    electrumClient.close()

    assert.deepEqual(tx, {})
  })
})


