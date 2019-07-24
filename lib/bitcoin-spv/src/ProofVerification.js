const Hash = require('./Hash')

module.exports.verify = function verify(proofHex, index) {
  const proof = fromHex(proofHex)

  const root = proof.slice(proof.length - 32, proof.length) // expectedRoot

  let currentHash = proof.slice(0, 32)

  // For all hashes between first and last
  for (let i = 1; i < (Math.floor(proof.length / 32) - 1); i++) {
    // If the current index is even,
    // The next hash goes before the current one
    if ((index % 2) == 0) {
      const children = Buffer.concat([proof.slice(i * 32, (i + 1) * 32), currentHash])
      currentHash = Hash.hash256(children)

      // Halve and floor the index
      index = Math.floor(index / 2)
    } else {
      // The next hash goes after the current one
      const children = Buffer.concat([currentHash, proof.slice(i * 32, (i + 1) * 32)])
      currentHash = Hash.hash256(children)

      // Halve and ceil the index
      index = Math.ceil(index / 2)
    }
  }

  // At the end we should have made the root
  if (currentHash.equals(root)) {
    return true
  } else {
    return false
  }
}


function fromHex(hex) {
  return Buffer.from(hex, 'hex')
}
