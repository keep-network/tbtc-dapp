
exports.toHex = function (bytes) {
  const buffer = Buffer.from(bytes)
  return buffer.toString('hex')
}
