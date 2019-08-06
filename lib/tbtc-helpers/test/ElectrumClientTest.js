const ElectrumClient = require('../src/ElectrumClient')
const fs = require('fs')
const chai = require('chai')
const assert = chai.assert
const config = require('../../../config/config.json')

describe('ElectrumClient', async () => {
  let client


  before(async () => {
    const txData = fs.readFileSync('./test/data/tx.json', 'utf8')
    tx = JSON.parse(txData)

    client = new ElectrumClient.Client(config.electrum.testnetPublic)

    await client.connect()
  })

  after(async () => {
    client.close()
  })

  describe('functions', async () => {
    it('getTransaction', async () => {
      const expectedTx = tx.hex
      const result = await client.getTransaction(tx.hash)

      assert.equal(
        result.hex,
        expectedTx,
        'unexpected result',
      )
    })

    it('getMerkleProof', async () => {
      const expectedResult = tx.merkleProof
      const expectedPosition = tx.indexInBlock
      const result = await client.getMerkleProof(tx.hash, tx.blockHeight)

      assert.equal(
        result.proof,
        expectedResult,
        'unexpected result',
      )

      assert.equal(
        result.position,
        expectedPosition,
        'unexpected result',
      )
    })

    it('getHeadersChain', async () => {
      const confirmations = tx.chainHeadersNumber
      const expectedResult = tx.chainHeaders
      const result = await client.getHeadersChain(tx.blockHeight, confirmations)

      assert.equal(
        result,
        expectedResult,
        'unexpected result',
      )
    })

    describe('findOutputForAddress', async () => {
      it('finds first element', async () => {
        const address = 'tb1qfdru0xx39mw30ha5a2vw23reymmxgucujfnc7l'
        expectedResult = 0

        result = await client.findOutputForAddress(tx.hash, address)

        assert.equal(
          result,
          expectedResult
        )
      })

      it('finds second element', async () => {
        const address = 'tb1q78ezl08lyhuazzfz592sstenmegdns7durc4cl'
        expectedResult = 1

        result = await client.findOutputForAddress(tx.hash, address)

        assert.equal(
          result,
          expectedResult
        )
      })

      it('fails for missing address', async () => {
        const address = 'NOT_EXISTING_ADDRESS'
        expectedResult = 1

        await client.findOutputForAddress(tx.hash, address)
          .then(
            (value) => { // onFulfilled
              assert.fail('not failed as expected')
            },
            (reason) => { // onRejected
              assert.include(reason.toString(), `output for address ${address} not found`)
            }
          )
      })
    })
  })
})
