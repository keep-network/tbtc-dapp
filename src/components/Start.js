import React, { Component } from 'react'

import history from '../history'
import Check from './svgs/Check'

class Start extends Component {

  handleClickPay = (evt) => {
    evt.preventDefault()
    evt.stopPropagation()

    history.push('/invoice')
  }

  getWeb3Status() {
    const { account, loading, web3} = this.props

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

  render() {
    return (
      <div className="start">
        <div className="page-top">
          { this.getWeb3Status() }
        </div>
        <div className="page-body">
          <div className="step">
            Step 1/5
          </div>
          <div className="title">
            Begin a bond
          </div>
          <hr />
          <div className="description">
            Maecenas sed diam eget risus varius blandit sit amet non magna.  Maecenas sed diam eget risus varius blandit sit amet non magna.
          </div>
          <div className="cta">
            <a href="/invoice" onClick={this.handleClickPay}>
              Begin now >>>
            </a>
          </div>
        </div>
      </div>
    )
  }
}

export default Start
