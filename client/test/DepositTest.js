import { createDeposit, setDefaults, getDepositBtcAddress } from '../src'

import {
  Deposit
} from '../src/eth/contracts'

const Web3 = require('web3')

const BN = require('bn.js')
const chai = require('chai')
const expect = chai.expect
const bnChai = require('bn-chai')
chai.use(bnChai(BN))

let web3

// We skip this test until we configure ethereum chain and deployment for the
// CI. Currently this test can be executed only manually on prepared ethereum
// environment with deployed contracts.
describe.skip('Ethereum helpers', async () => {
  before(async () => {
    // TruffleContract was built to use web3 0.3.0, which uses an API method of `sendAsync`
    // in later versions of web (1.0.0), this method was renamed to `send`
    // This hack makes them work together again.
    // https://github.com/ethereum/web3.js/issues/1119
    Web3.providers.HttpProvider.prototype.sendAsync = Web3.providers.HttpProvider.prototype.send

    web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))
    await setDefaults(web3)
  })

  it('#createDeposit', async () => {
    const depositAddress = await createDeposit()
    const deposit = await Deposit.at(depositAddress)

    expect(await deposit.getCurrentState()).to.eq.BN('1')
  })

  it('#getDepositBtcAddress', async () => {
    const depositAddress = await createDeposit()
    const btcAddress = await getDepositBtcAddress(depositAddress)
    expect(btcAddress.substring(0, 2)).to.equal('tb')
  })
})