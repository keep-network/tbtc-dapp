const bcoin = require('bcoin')
const BN = require('bcrypto/lib/bn')
const Signature = require('bcrypto/lib/internal/signature')
const secp256k1 = require('bcrypto/lib/js/secp256k1')

/**
 * Creates a Bitcoin SegWit transaction with one input and one output. Difference
 * between previous output's value and current's output value will be taken as
 * a transaction fee.
 * @param {Buffer} previousOutpoint Previous transaction's output to be used as
 * an input. Provided in raw format, consists of 32-byte transaction ID and
 * 4-byte output index number.
 * @param {uint32} inputSequence Input's sequence number. As per BIP-125 the value
 * is used to indicate that transaction should be able to be replaced in the future.
 * If input sequence is set to `0xffffffff` the transaction won't be replaceable.
 * @param {BN} outputValue Value for the output.
 * @param {string} outputPKH Public Key Hash for the output.
 * @return {string} Raw bitcoin transaction in a hexadecimal format.
 */
export function oneInputOneOutputWitnessTX(
  previousOutpoint,
  inputSequence,
  outputValue,
  outputPKH,
) {
  // Input
  const prevOutpoint = bcoin.Outpoint.fromRaw(previousOutpoint)

  const input = bcoin.Input.fromOptions({
    prevout: prevOutpoint,
    sequence: inputSequence,
  })

  // Output
  // TODO: When we want to give user a possibility to provide an address instead
  // of a public key hash we need to change it to `fromAddress`.
  const outputScript = bcoin.Script.fromProgram(
    0, // Witness program version
    outputPKH
  )

  const output = bcoin.Output.fromOptions({
    value: outputValue.toNumber(),
    script: outputScript,
  })

  // Transaction
  const transaction = bcoin.TX.fromOptions({
    inputs: [input],
    outputs: [output],
  })

  return transaction.toRaw().toString('hex')
}

/**
 * Converts signature provided as `r` and `s` values to a bitcoin signature
 * encoded to the DER format:
 *   30 <length total> 02 <length r> <r (BE)> 02 <length s> <s (BE)>
 * It also checks `s` value and converts it to a low value if necessary as per
 * [BIP-0062](https://github.com/bitcoin/bips/blob/master/bip-0062.mediawiki#low-s-values-in-signatures).
 * @param {Buffer} r A signature's `r` value.
 * @param {Buffer} s A signature's `s` value.
 * @return {Buffer} The signature in the DER format.
 */
export function bitcoinSignatureDER(r, s) {
  const size = secp256k1.size
  const signature = new Signature(size, r, s)

  // Verifies if either of `r` or `s` values equals zero or is greater or equal
  // curve's order. If so throws an error.
  // Checks if `s` is a high value. As per BIP-0062 signature's `s` value should
  // be in a low half of curve's order. If it's a high value it's converted to
  // `-s`.
  // Checks `s` per BIP-62: signature's `s` value should be in a low half of
  // curve's order. If it's not, it's converted to `-s`.
  const bitcoinSignature = secp256k1.signatureNormalize(signature.encode(size))

  return Signature.toDER(bitcoinSignature, size)
}

/**
 * Adds a witness signature for an input in a transaction.
 * @param {string} unsignedTransaction Unsigned raw bitcoin transaction in hexadecimal format.
 * @param {uint32} inputIndex Index number of input to be signed.
 * @param {Buffer} r Signature's `r` value.
 * @param {Buffer} s Signature's `s` value.
 * @param {Buffer} publicKey 64-byte signer's public key's concatenated x and y
 * coordinates.
 * @return {string} Raw transaction in a hexadecimal format with witness signature.
 */
export function addWitnessSignature(unsignedTransaction, inputIndex, r, s, publicKey) {
  // Signature
  let signatureDER
  try {
    signatureDER = bitcoinSignatureDER(r, s)
  } catch (err) {
    throw new Error(`failed to convert signature to DER format: [${err}]`)
  }

  const hashType = Buffer.from([bcoin.Script.hashType.ALL])
  const sig = Buffer.concat([signatureDER, hashType])

  // Public Key
  let compressedPublicKey
  try {
    compressedPublicKey = secp256k1.publicKeyImport(publicKey, true)
  } catch (err) {
    throw new Error(`failed to import public key: [${err}]`)
  }

  // Combine witness
  let signedTransaction
  try {
    signedTransaction = bcoin.TX.fromRaw(unsignedTransaction, 'hex').clone()
  } catch (err) {
    throw new Error(`failed to import transaction: [${err}]`)
  }

  signedTransaction.inputs[inputIndex].witness.fromItems([sig, compressedPublicKey])

  return signedTransaction.toRaw().toString('hex')
}
