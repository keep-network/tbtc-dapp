const secp256k1 = require('bcrypto/lib/secp256k1')
const keyring = require('bcoin/lib/primitives/keyring')
const Script = require('bcoin/lib/script').Script

const ChainType = Object.freeze({ 'mainnet': 1, 'testnet': 2 })

// publicKeyToP2WPKHaddress converts public key to bitcoin Witness Public Key Hash
// Address. It expects raw public key as a hexadecimal representation of 64 byte
// concatenation of x and y coordinates. It calculates the address according to [BIP-173].
//
// [BIP-173]: https://github.com/bitcoin/bips/blob/master/bip-0173.mediawiki
function publicKeyToP2WPKHaddress(publicKeyRaw, chainType) {
  const compress = true

  const buffer = Buffer.from(publicKeyRaw, 'hex')

  // let address
  publicKey = secp256k1.publicKeyImport(buffer, compress)
  ring = keyring.fromKey(publicKey, compress)

  p2wpkhScript = Script.fromProgram(0, ring.getKeyHash())
  const address = p2wpkhScript.getAddress()

  return address.toString(chainTypeToBCOINnetwork(chainType))
}

function chainTypeToBCOINnetwork(chainType) {
  switch (chainType) {
  case ChainType.mainnet:
    return 'main'
  case ChainType.testnet:
    return 'testnet'
  default:
    throw new Error(
      `unsupported chain type [${chainType}], use one of: [${Object.keys(ChainType)
        .map((key) => {
          return 'ChainType.' + key
        })}]`
    )
  }
}

module.exports.ChainType = ChainType
module.exports.publicKeyToP2WPKHaddress = publicKeyToP2WPKHaddress
