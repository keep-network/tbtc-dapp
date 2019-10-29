const { 
  getTransactionProof
} = require(`../src/FundingProof`)
const {
  waitForConfirmations
} = require('../src/FundingTransaction')
const electrumConfig = require('../../src/config/config.json')
const {
    ElectrumClient,
    BitcoinTxParser,
    BitcoinSPV
} = require('tbtc-helpers')

const contracts = require('../src/eth/contracts')
const {
  Deposit
} = contracts

const depositAddress = process.argv[4]
const txID = process.argv[5]
console.log(depositAddress,txID)

async function submitRedemptionProof(
    depositAddress,
    spvProof,
    redemptionOutputIndex
) {
    // Parse transaction to get required details.
    let txDetails
    try {
      txDetails = await BitcoinTxParser.parse(spvProof.tx)
    } catch (err) {
      throw new Error(`failed to parse spv proof: [${err}]`)
    }
  
    // Submit funding proof to the deposit contract.
    const deposit = await Deposit.at(depositAddress)
  
    const result = await deposit.provideRedemptionProof(
      Buffer.from(txDetails.version, 'hex'),
      Buffer.from(txDetails.txInVector, 'hex'),
      Buffer.from(txDetails.txOutVector, 'hex'),
      Buffer.from(txDetails.locktime, 'hex'),
      Buffer.from(spvProof.merkleProof, 'hex'),
      spvProof.txInBlockIndex,
      Buffer.from(spvProof.chainHeaders, 'hex')
    ).catch((err) => {
      throw new Error(`failed to submit funding transaction proof: [${err}]`)
    })
  
    return result.tx
}

async function run() {
  await contracts.setDefaults(web3)

  const electrumClient = new ElectrumClient.Client(electrumConfig.electrum.testnetWS)
  await electrumClient.connect()

  const confirmations = 1
  const redemptionOutputIndex = 0
  
  await waitForConfirmations(electrumClient, txID)
  const spvProof = await getTransactionProof(electrumClient, txID, confirmations)

  let tx = await submitRedemptionProof(
    depositAddress,
    spvProof,
    redemptionOutputIndex
  )

  console.log(
    JSON.stringify(tx,null,1)
  )
}

module.exports = async function() {
    try {
        await run()
    } catch (ex) {
        console.error(ex)
        process.exit(1)
    }
}