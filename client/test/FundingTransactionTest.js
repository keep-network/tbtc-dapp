const FundingTransaction = require('../src/FundingTransaction')
const ElectrumClient = require('tbtc-helpers').ElectrumClient
const config = require('../../config/config.json')

const chai = require('chai')
const assert = chai.assert

describe('FundingTransaction', async () => {
  describe('watchForFundingTransaction', async () => {
    let electrumClient
    let txData

    before(async () => {
      txData = require('tbtc-helpers/test/data/tx.json')

      electrumClient = new ElectrumClient.Client(config.electrum.testnetPublic)

      await electrumClient.connect()
        .catch((err) => {
          throw new Error(`failed to connect electrum client: [${err}]`)
        })
    })

    after(async () => {
      await electrumClient.close()
        .catch((err) => {
          throw new Error(`failed to disconnect from electrum client: [${err}]`)
        })
    })

    it('finds a transaction with expected value', async () => {
      const outputPosition = 0
      const address = txData.outputs[outputPosition].address
      const expectedValue = txData.outputs[outputPosition].value

      const expectedResult = {
        fundingOutputPosition: outputPosition,
        transactionID: txData.hash,
        value: txData.outputs[outputPosition].value,
      }

      const result = await FundingTransaction.watchForFundingTransaction(electrumClient, address, expectedValue)

      assert.deepEqual(result, expectedResult)
    })

    it.skip('finds a transaction but value does not match', async () => {
      // TODO: We should implement this test when we have mocked electrum client.
      // Test scenario:
      // 1. Transaction for script already exists but value doesn't match.
      // 2. Function is waiting for a new transaction to be sent.
      // 3. We mock new transaction being sent and mock the response of unspent
      //    transaction to match the required value.
      // 4. Test passes.
    })
  })

  describe('waitForConfirmations', async () => {
    let electrumClient
    let txData

    before(async () => {
      txData = require('tbtc-helpers/test/data/tx.json')

      electrumClient = new ElectrumClient.Client(config.electrum.testnetPublic)

      await electrumClient.connect()
        .catch((err) => {
          throw new Error(`failed to connect electrum client: [${err}]`)
        })
    })

    after(async () => {
      await electrumClient.close()
        .catch((err) => {
          throw new Error(`failed to disconnect from electrum client: [${err}]`)
        })
    })

    it('succeeds when transaction already has confirmations', async () => {
      const transactionID = txData.hash

      const result = await FundingTransaction.waitForConfirmations(electrumClient, transactionID)

      assert.isTrue(result >= 1)
    })

    it.skip('waits for enough confirmations', async () => {
      // TODO: We should implement this test when we have mocked electrum client.
      // Transaction has not enough confirmations yet and we wait for a new block
      // to be mined and transaction to get more confirmations.
    })
  })
})
