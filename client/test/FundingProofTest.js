const rewire = require('rewire')
const FundingProof = rewire('../src/FundingProof')
const ElectrumClient = require('tbtc-helpers').ElectrumClient
const config = require('../../config/config.json')

const fs = require('fs')
const chai = require('chai')
const assert = chai.assert

const TX_ID = '72e7fd57c2adb1ed2305c4247486ff79aec363296f02ec65be141904f80d214e'
const CONFIRMATIONS = 6

describe('FundingProof', async () => {
  it('getTransactionProof', async () => {
    const electrumClient = new ElectrumClient.Client(config.electrum.testnetPublic)

    const proofFile = fs.readFileSync('./test/data/proof.json', 'utf8')
    const expectedResult = JSON.parse(proofFile)

    const result = await FundingProof.__get__('getTransactionProof')(electrumClient, TX_ID, CONFIRMATIONS)

    assert.deepEqual(result, expectedResult)
  })
})
