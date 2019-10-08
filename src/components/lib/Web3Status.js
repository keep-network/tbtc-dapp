import React, { Component } from 'react'

import { withWeb3, withAccount, withConnectDapp } from '../../wrappers/web3'
import Check from '../svgs/Check'

class Web3Status extends Component {
  componentDidMount() {
    this.props.connectDapp()
  }

  render() {
    const { account, loading, web3 } = this.props

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
}

export default withConnectDapp(withWeb3(withAccount(Web3Status)))
