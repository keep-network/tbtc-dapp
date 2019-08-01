const Web3 = require('web3')

import { createDeposit, setDefaults, initializeDeposit, getDepositBTCPublicKey, waitDepositBTCPublicKey } from '../src'
import { setElectrumConfig } from '../src/FundingProof';

import {
    TBTCSystem,
    TBTCToken,
    KeepBridge,
    Deposit
} from '../src/eth/contracts'

const BN = require('bn.js')
const chai = require('chai')
const expect = chai.expect
const bnChai = require('bn-chai')
chai.use(bnChai(BN))

let web3

describe("Ethereum helpers", async () => {
    before(async () => {        
        Web3.providers.HttpProvider.prototype.sendAsync = Web3.providers.HttpProvider.prototype.send
        web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
        await setDefaults(web3)

        // setElectrumConfig({
        //     "testnet": {
        //         "server": "electrumx-server.tbtc.svc.cluster.local",
        //         "port": 50002,
        //         "protocol": "tls"
        //     }
        // })
    })

    it('#createDeposit', async () => {
        const depositAddress = await createDeposit()
        const deposit = await Deposit.at(depositAddress)

        expect(await deposit.getCurrentState()).to.eq.BN('1')
    })

    it('#getDepositBTCPublicKey', async () => {
        const depositAddress = await createDeposit()
        let key = await getDepositBTCPublicKey(depositAddress)
        expect(key).to.be.of.length(2);
    })    
})