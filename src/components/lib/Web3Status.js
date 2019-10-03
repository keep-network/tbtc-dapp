import React from 'react'

import { withWeb3, withAccount } from '../../wrappers/web3'
import Check from '../svgs/Check'

const Web3Status = ({ account, loading, web3 }) => {
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
        Web3 not detected.  We suggest <a href="http://metamask.io" target="_blank" rel="noopener noreferrer">MetaMask</a>.
        </div>
    )
  }

  if (!account) {
    return (
      <div className="web3-status notify">
        Web3 detected, but you need to connect & log into an account.
        </div>
    )
  }

  return (
    <div className="web3-status success">
      <Check width="15px" /> Account logged in
      </div>
  )
}

export default withWeb3(withAccount(Web3Status))
