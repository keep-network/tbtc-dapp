const FundingProof = require('../src/FundingProof')
const ElectrumClient = require('tbtc-helpers').ElectrumClient

const fs = require('fs')
const chai = require('chai')
const assert = chai.assert

const TX_ID = '72e7fd57c2adb1ed2305c4247486ff79aec363296f02ec65be141904f80d214e'
const CONFIRMATIONS = 6


describe('FundingProof', async () => {
  let electrumConfig

  before(async () => {
    const configFile = fs.readFileSync(process.env.CONFIG_FILE, 'utf8')
    config = JSON.parse(configFile)

    electrumConfig = new ElectrumClient.Config(
      config.electrum.testnet.server,
      config.electrum.testnet.port,
      config.electrum.testnet.protocol
    )
  })

  it('getProof', async () => {
    const proofFile = fs.readFileSync('./test/data/proof.json', 'utf8')
    const expectedResult = JSON.parse(proofFile)

    const result = await FundingProof.getTransactionProof(electrumConfig, TX_ID, CONFIRMATIONS)

    assert.deepEqual(result, expectedResult)
  })
})
