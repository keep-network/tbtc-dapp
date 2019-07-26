
export { publicKeyToP2WPKHaddress, networkToBCOINvalue } from '../../../lib/tbtc-helpers/src/Address.js'

export function generateFundingProof() {
    const fundingProof = await FundingProof.getTransactionProof(electrumConfig, txId, confirmations)
    return fundingProof
}