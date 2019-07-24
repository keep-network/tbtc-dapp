const FundingProof = require('../src/FundingProof.js')
const BitcoinSPV = require('bitcoin-spv')
const ElectrumClient = require('electrum-client')

const fs = require('fs')
const chai = require('chai')
const assert = chai.assert

const TX_ID = '72e7fd57c2adb1ed2305c4247486ff79aec363296f02ec65be141904f80d214e'
const CONFIRMATIONS = 6

describe('BitcoinSPV', async () => {
  let tx
  let bitcoinSPV

  before(async () => {
    const configFile = fs.readFileSync(process.env.CONFIG_FILE, 'utf8')
    config = JSON.parse(configFile)

    const electrumClient = new ElectrumClient(
      config.electrum.server,
      config.electrum.port,
      config.electrum.protocol
    )

    bitcoinSPV = new BitcoinSPV()

    await bitcoinSPV.initialize(electrumClient)
  })

  after(async () => {
    bitcoinSPV.close()
  })

  it('getProof', async () => {
    const proofFile = fs.readFileSync('./test/data/proof.json', 'utf8')
    expectedResult = JSON.parse(proofFile)

    const result = await FundingProof.getTransactionProof(bitcoinSPV, TX_ID, CONFIRMATIONS)

    assert.deepEqual(result, expectedResult)
  })
})
