const ProofVerification = require('../src/ProofVerification')

const fs = require('fs')
const chai = require('chai')
const assert = chai.assert

describe('ProofVerification', async () => {
  let tx

  before(async () => {
    const txData = fs.readFileSync('./test/data/tx.json', 'utf8')
    tx = JSON.parse(txData)
  })

  it('verifyProof', async () => {
    const proofHex = tx.merkleProof
    const index = tx.indexInBlock
    const result = ProofVerification.verify(proofHex, index)

    assert.isTrue(result)
  })
})
