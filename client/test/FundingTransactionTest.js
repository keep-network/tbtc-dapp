const FundingTransaction = require('../src/FundingTransaction')

const fs = require('fs')
const chai = require('chai')
const assert = chai.assert

describe('FundingTransaction', async () => {
  it('awaitFundingTransaction', async () => {
    const txDataFile = fs.readFileSync('node_modules/tbtc-helpers/test/data/tx.json', 'utf8')
    const txData = JSON.parse(txDataFile)

    const outputPosition = 0
    const address = txData.outputs[outputPosition].address

    const expectedResult = {
      blockHeight: txData.blockHeight,
      fundingOutputPosition: outputPosition,
      transactionID: txData.hash,
      value: txData.outputs[outputPosition].value,
    }

    const result = await FundingTransaction.awaitFundingTransaction(address)

    assert.deepEqual(result, expectedResult)
  })
})
