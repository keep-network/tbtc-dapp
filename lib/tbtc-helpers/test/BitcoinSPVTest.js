const bitcoinSPV = require('../src/BitcoinSPV')
const ElectrumClient = require('../src/ElectrumClient')

const fs = require('fs')
const chai = require('chai')
const assert = chai.assert

const ELECTRUM_SERVER = 'tn.not.fyi'
const ELECTRUM_PORT = 55002
const ELECTRUM_PROTOCOL = 'tls'


describe('BitcoinSPV', async () => {
  let tx

  before(async () => {
    const txData = fs.readFileSync('./test/data/tx.json', 'utf8')
    tx = JSON.parse(txData)

    electrumConfig = new ElectrumClient.Config(ELECTRUM_SERVER, ELECTRUM_PORT, ELECTRUM_PROTOCOL)

    await bitcoinSPV.initialize(electrumConfig)
  })

  after(async () => {
    bitcoinSPV.close()
  })

  it('getTransactionProof', async () => {
    const expectedResult = {
      tx: tx.hex,
      merkleProof: tx.merkleProof,
      txInBlockIndex: tx.indexInBlock,
      chainHeaders: tx.chainHeaders,
    }

    const result = await bitcoinSPV.getTransactionProof(tx.hash, tx.chainHeadersNumber)

    assert.deepEqual(result, expectedResult)
  })


  it('verifyMerkleProof', async () => {
    const proofHex = tx.merkleProof
    const index = tx.indexInBlock
    const result = bitcoinSPV.verifyMerkleProof(proofHex, index)

    assert.isTrue(result)
  })
})
