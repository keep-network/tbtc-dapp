const FundingTransaction = require('../src/FundingTransaction')
const ElectrumClient = require('tbtc-helpers').ElectrumClient
const config = require('../config/config.json')

const chai = require('chai')
const assert = chai.assert

describe('FundingTransaction', async () => {
  describe('waitForConfirmations', async () => {
    let electrumClient
    let txData

    before(async () => {
      txData = require('tbtc-helpers/test/data/tx.json')

      electrumClient = new ElectrumClient.Client(config.electrum.testnet)

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
