import React from 'react'

import { withWeb3, withAccount } from '../../wrappers/web3'
import Check from '../svgs/Check'

const Web3Status = ({ account, loading, web3} ) => {
    if (loading) {
      return (
        <div className="web3-status loading">
          loading...
        </div>
      )
    }

    if (!web3) {
      return (
        <div className="web3-status alert">
          Web3 not detected.  We suggest <a href="http://metamask.io" target="_blank" rel="noopener noreferrer">Metamask</a>.
        </div>
      )
    }

    // TODO: Figure out why this is always true
    if (!web3.eth.currentProvider.isConnected()) {
      return (
        <div className="web3-status notify">
          Web3 detected, but you need to connect this dApp.
        </div>
      )
    }

    if (!account) {
      return (
        <div className="web3-status notify">
          Web3 connected, but you need to log into an acccount.
        </div>
      )
    }

    return (
      <div className="web3-status success">
        <Check width="25px" /> Account logged in
      </div>
    )
}

export default withWeb3(withAccount(Web3Status))