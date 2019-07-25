const secp256k1 = require('bcrypto/lib/secp256k1')
const keyring = require('bcoin/lib/primitives/keyring')
const Script = require('bcoin/lib/script').Script

const Network = Object.freeze({ 'mainnet': 1, 'testnet': 2 })

// publicKeyToP2WPKHaddress converts public key to bitcoin Witness Public Key Hash
// Address. It expects raw public key as a hexadecimal representation of 64 byte
// concatenation of x and y coordinates. It calculates the address according to [BIP-173].
//
// [BIP-173]: https://github.com/bitcoin/bips/blob/master/bip-0173.mediawiki
function publicKeyToP2WPKHaddress(publicKeyRaw, network) {
  const compress = true

  const buffer = Buffer.from(publicKeyRaw, 'hex')

  // let address
  publicKey = secp256k1.publicKeyImport(buffer, compress)
  ring = keyring.fromKey(publicKey, compress)

  p2wpkhScript = Script.fromProgram(0, ring.getKeyHash())
  const address = p2wpkhScript.getAddress()

  // Serialize address to a format specific to given network.
  return address.toString(networkToBCOINvalue(network))
}

// Maps Network enumeration value to a respective name from bcoin library.
function networkToBCOINvalue(network) {
  switch (network) {
  case Network.mainnet:
    return 'main'
  case Network.testnet:
    return 'testnet'
  default:
    throw new Error(
      `unsupported network [${networkType}], use one of: [${Object.keys(network)
        .map((key) => {
          return 'Network.' + key
        })}]`
    )
  }
}

module.exports = {
  Network, publicKeyToP2WPKHaddress,
}
