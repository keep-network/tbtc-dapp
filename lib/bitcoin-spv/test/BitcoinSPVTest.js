const BitcoinSPV = require('../src/BitcoinSPV.js')
const ElectrumClient = require('electrum-client')

const fs = require('fs')
const chai = require('chai')
const assert = chai.assert

const ELECTRUM_SERVER = "tn.not.fyi"
const ELECTRUM_PORT = 55002
const ELECTRUM_PROTOCOL = "tls"


describe('BitcoinSPV', async () => {
  let tx
  let bitcoinSPV

  before(async () => {
    const txData = fs.readFileSync('./test/data/tx.json', 'utf8')
    tx = JSON.parse(txData)

    const electrumClient = new ElectrumClient(
      ELECTRUM_SERVER,
      ELECTRUM_PORT,
      ELECTRUM_PROTOCOL
    )

    bitcoinSPV = new BitcoinSPV()

    await bitcoinSPV.initialize(electrumClient)
  })

  after(async () => {
    bitcoinSPV.close()
  })

  it('getProof', async () => {
    const expectedResult = {
      tx: tx.hex,
      merkleProof: tx.merkleProof,
      txInBlockIndex: tx.indexInBlock,
      chainHeaders: tx.chainHeaders,
    }

    const result = await bitcoinSPV.getProof(tx.hash, tx.chainHeadersNumber)

    assert.deepEqual(result, expectedResult)
  })
})
