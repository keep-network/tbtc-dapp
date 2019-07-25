const proof = require('../src/Proof')
const ElectrumClient = require('electrum-client')

const fs = require('fs')
const chai = require('chai')
const assert = chai.assert

const ELECTRUM_SERVER = 'tn.not.fyi'
const ELECTRUM_PORT = 55002
const ELECTRUM_PROTOCOL = 'tls'


describe('Proof', async () => {
  let tx
  // let proof

  before(async () => {
    const txData = fs.readFileSync('./test/data/tx.json', 'utf8')
    tx = JSON.parse(txData)

    const electrumClient = new ElectrumClient(
      ELECTRUM_SERVER,
      ELECTRUM_PORT,
      ELECTRUM_PROTOCOL
    )
    // proof = Proof
    await proof.initialize(electrumClient)
  })

  after(async () => {
    proof.close()
  })

  it('getTransactionProof', async () => {
    const expectedResult = {
      tx: tx.hex,
      merkleProof: tx.merkleProof,
      txInBlockIndex: tx.indexInBlock,
      chainHeaders: tx.chainHeaders,
    }

    const result = await proof.getTransactionProof(tx.hash, tx.chainHeadersNumber)

    assert.deepEqual(result, expectedResult)
  })


  it('verifyMerkleProof', async () => {
    const proofHex = tx.merkleProof
    const index = tx.indexInBlock
    const result = proof.verifyMerkleProof(proofHex, index)

    assert.isTrue(result)
  })
})
