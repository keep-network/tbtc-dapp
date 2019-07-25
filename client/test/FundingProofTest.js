const FundingProof = require('../src/FundingProof.js')
const BitcoinSPV = require('bitcoin-spv')
const ElectrumClient = require('electrum-client')

const fs = require('fs')
const chai = require('chai')
const assert = chai.assert

const TX_ID = '72e7fd57c2adb1ed2305c4247486ff79aec363296f02ec65be141904f80d214e'
const CONFIRMATIONS = 6

describe('FundingProof', async () => {
  let bitcoinSPVProof

  before(async () => {
    const configFile = fs.readFileSync(process.env.CONFIG_FILE, 'utf8')
    config = JSON.parse(configFile)

    const electrumClient = new ElectrumClient(
      config.electrum.server,
      config.electrum.port,
      config.electrum.protocol
    )

    bitcoinSPVProof = BitcoinSPV.Proof

    await bitcoinSPVProof.initialize(electrumClient)
  })

  after(async () => {
    bitcoinSPVProof.close()
  })

  it('getProof', async () => {
    const proofFile = fs.readFileSync('./test/data/proof.json', 'utf8')
    const expectedResult = JSON.parse(proofFile)

    const result = await FundingProof.getTransactionProof(bitcoinSPVProof, TX_ID, CONFIRMATIONS)

    assert.deepEqual(result, expectedResult)
  })
})
