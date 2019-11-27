import {
  TBTCSystem,
} from './eth/contracts'

const web3 = require('web3')

/**
 * Gets address of a keep created for the deposit. Finds the deposit creation
 * event and returns keep value emitted in the event.
 * @param {string} depositAddress Address of the deposit.
 * @return {string} Address of the keep.
 */
export async function getKeepAddress(depositAddress) {
  const tbtcSystem = await TBTCSystem.deployed()
  const events = await tbtcSystem.getPastEvents('Created', {
    fromBlock: 0,
    toBlock: 'latest',
    filter: { _depositContractAddress: depositAddress },
  })
  return events[0].returnValues._keepAddress
}

/**
 * Gets public key of the keep. Finds a public key registration event and
 * returns a public key emitted in the event. Public key is logged in the event
 * as x and y coordinates, it concatenates these values.
 * @param {string} depositAddress Address of the deposit.
 * @return {Buffer} Public key as concatenated x and y coordinates.
 */
export async function getKeepPublicKey(depositAddress) {
  const depositLog = await TBTCSystem.deployed()

  const publickKeyEvents = await depositLog.getPastEvents(
    'RegisteredPubkey',
    {
      fromBlock: 0,
      toBlock: 'latest',
      filter: { _depositContractAddress: depositAddress },
    }
  )

  const publicKeyX = Buffer.from(web3.utils.hexToBytes(publickKeyEvents[0].returnValues._signingGroupPubkeyX))
  const publicKeyY = Buffer.from(web3.utils.hexToBytes(publickKeyEvents[0].returnValues._signingGroupPubkeyY))

  return Buffer.concat([Buffer.from(publicKeyX), Buffer.from(publicKeyY)])
}
