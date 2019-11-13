import React, { Component } from 'react'
import classnames from 'classnames'

import history from '../../history'
import StatusIndicator from '../svgs/StatusIndicator'
import TLogo from '../svgs/tlogo'
import Check from '../svgs/Check'
import X from '../svgs/X'

class InputAddresses extends Component {

  state = {
    contractAddress: '',
    contractAddressIsValid: false,
    btcAddress: '',
    btcAddressIsValid: false
  }

  handleClickConfirm = (evt) => {
    evt.preventDefault()
    evt.stopPropagation()

    history.push('/redeem/confirming')
  }

  handleContractAddressChange = (evt) => {
    // TODO: Validate contract address
    const isValid = evt.target.value.length > 0 && true
    const hasError = evt.target.value.length > 0 && false

    this.setState({
      contractAddress: evt.target.value,
      contractAddressIsValid: isValid,
      contractAddressHasError: hasError
    })
  }

  handleBtcAddressChange = (evt) => {
    // TODO: Validate btc address
    const isValid = evt.target.value.length > 0 && true
    const hasError = evt.target.value.length > 0 && false

    this.setState({
      btcAddress: evt.target.value,
      btcAddressIsValid: isValid,
      btcAddressHasError: hasError
    })
  }

  render() {
    const {
      contractAddress,
      contractAddressIsValid,
      contractAddressHasError,
      btcAddress,
      btcAddressIsValid,
      btcAddressHasError
    } = this.state

    return (
      <div className="input-addresses">
        <div className="page-top">
          <StatusIndicator purple>
            <TLogo height={100} width={100} />
          </StatusIndicator>
        </div>
        <div className="page-body">
          <div className="step">
            Step 2/4
          </div>
          <div className="title">
            Redeem bond
          </div>
          <hr />
          <div className="description">
          <div className={classnames("paste-field", { success: contractAddressIsValid, alert: contractAddressHasError })}>
              <label htmlFor="contract-address">
                What was your deposit address?
              </label>
              <input
                type="text"
                id="contract-address"
                onChange={this.handleContractAddressChange}
                value={contractAddress}
                placeholder="Enter ETH Deposit Address"
              />
              { contractAddressIsValid && <Check height="28px" width="28px" /> }
              { contractAddressHasError && <X height="28px" width="28px" /> }
            </div>
            <div className={classnames("paste-field", { success: btcAddressIsValid, alert: btcAddressHasError })}>
              <label htmlFor="btc-address">
                Where should we send your Bitcoin?
              </label>
              <input
                type="text"
                id="btc-address"
                onChange={this.handleBtcAddressChange}
                value={btcAddress}
                placeholder="Enter BTC Address"
              />
              { btcAddressIsValid && <Check height="28px" width="28px" /> }
              { btcAddressHasError && <X height="28px" width="28px" /> }
            </div>
          </div>
          <div className='cta'>
            <button
              onClick={this.handleClickConfirm}
              disabled={!contractAddressIsValid || !btcAddressIsValid}
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

export default InputAddresses
