import React, { Component } from 'react'
import classnames from 'classnames'

import history from '../../history'
import { withAccount } from '../../wrappers/web3'
import Wavy from '../svgs/Wavy'
import Check from '../svgs/Check'
import X from '../svgs/X'

class Start extends Component {

  state = {
    contractAddress: '',
    contractAddressIsValid: false,
    btcAddress: '',
    btcAddressIsValid: false
  }

  handleClickConfirm = (evt) => {
    evt.preventDefault()
    evt.stopPropagation()

    const { account } = this.props

    if (account) {
      history.push('/redeem/confirming')
    }
  }

  handleContractAddressChange = (evt) => {
    // TODO: Validate contract address
    const isValid = true
    this.setState({
      contractAddress: evt.target.value,
      contractAddressIsValid: isValid
    })
  }

  handleBtcAddressChange = (evt) => {
    // TODO: Validate btc address
    const isValid = true
    this.setState({
      btcAddress: evt.target.value,
      btcAddressIsValid: isValid
    })
  }

  render() {
    const {
      contractAddress,
      contractAddressIsValid,
      btcAddress,
      btcAddressIsValid
    } = this.state

    const contractAddressSuccess = contractAddress.length > 0 && contractAddressIsValid
    const contractAddressAlert = contractAddress.length > 0 && !contractAddressIsValid
    const btcAddressSuccess = btcAddress.length > 0 && btcAddressIsValid
    const btcAddressAlert = btcAddress.length > 0 && !btcAddressIsValid

    return (
      <div className="addresses">
        <div className="page-top">
          <Wavy tbtcLogo />
        </div>
        <div className="page-body">
          <div className="step">
            Step 2/4
          </div>
          <div className="title">
            Redeem a deposit
          </div>
          <hr />
          <div className="description">
          <div className={classnames("paste-field", { success: contractAddressSuccess, alert: contractAddressAlert })}>
              <label htmlFor="contract-address">
                Paste a contract address to redeem:
              </label>
              <input
                type="text"
                id="contract-address"
                onChange={this.handleContractAddressChange}
                value={contractAddress}
              />
              { contractAddressSuccess && <Check height="28px" width="28px" /> }
              { contractAddressAlert && <X height="28px" width="28px" /> }
            </div>
            <div className={classnames("paste-field", { success: btcAddressSuccess, alert: btcAddressAlert })}>
              <label htmlFor="btc-address">
                Paste a Bitcoin address to redeem:
              </label>
              <input
                type="text"
                id="btc-address"
                onChange={this.handleBtcAddressChange}
                value={btcAddress}
              />
              { btcAddressSuccess && <Check height="28px" width="28px" /> }
              { btcAddressAlert && <X height="28px" width="28px" /> }
            </div>
          </div>
          <div className='cta'>
            <button
              onClick={this.handleClickConfirm}
              disabled={!contractAddressSuccess || !btcAddressSuccess}
              className="black"
              >
              Confirm redemption
            </button>
          </div>
        </div>
      </div>
    )
  }
}

export default withAccount(Start)
