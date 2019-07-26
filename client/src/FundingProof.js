const BitcoinTxParser = require('tbtc-helpers').BitcoinTxParser
const bitcoinSPV = require('tbtc-helpers').BitcoinSPV

async function getTransactionProof(electrumConfig, txID, confirmations) {
  console.log('Get transaction proof...')

  bitcoinSPV.initialize(electrumConfig)

  if (txID.length != 64) {
    throw new Error(`invalid transaction id length [${txID.length}], required: [64]`)
  }

  const spvProof = await bitcoinSPV.getTransactionProof(txID, confirmations)
    .catch((err) => {
      bitcoinSPV.close(electrumConfig)
      return Promise.reject(new Error(`failed to get bitcoin spv proof: ${err}`))
    })

  bitcoinSPV.close(electrumConfig)

  let txDetails
  try {
    txDetails = await BitcoinTxParser.parse(spvProof.tx)
  } catch (err) {
    return Promise.reject(new Error(`failed to parse spv proof: ${err}`))
  }

  return {
    version: txDetails.version,
    txInVector: txDetails.txInVector,
    txOutVector: txDetails.txOutVector,
    locktime: txDetails.locktime,
    merkleProof: spvProof.merkleProof,
    txInBlockIndex: spvProof.txInBlockIndex,
    chainHeaders: spvProof.chainHeaders,
    fundingOutputIndex: 0, // TODO: Implement funding proof lookup
  }
}

async function submitTransactionProof() {
  // TODO: Submit proof to a contract

}

module.exports.getTransactionProof = getTransactionProof
