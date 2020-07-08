import React, { Component } from 'react'
import classnames from 'classnames'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { BitcoinHelpers } from "@keep-network/tbtc.js"

import StatusIndicator from '../svgs/StatusIndicator'
import TLogo from '../svgs/tlogo'
import Check from '../svgs/Check'
import X from '../svgs/X'
import { saveAddresses } from '../../actions'

import web3 from 'web3'

class Start extends Component {

  state = {
    depositAddress: '',
    depositAddressIsValid: false,
    btcAddress: '',
    btcAddressIsValid: false
  }

  handleClickConfirm = (evt) => {
    evt.preventDefault()
    evt.stopPropagation()

    const { saveAddresses } = this.props
    const { btcAddress, depositAddress } = this.state

    saveAddresses({
      btcAddress,
      depositAddress
    })
  }

  handleDepositAddressChange = (evt) => {
    const address = evt.target.value

    const isValid = web3.utils.isAddress(address)
    const hasError = ! isValid

    this.setState({
      depositAddress: address,
      depositAddressIsValid: isValid,
      depositAddressHasError: hasError
    })
  }

  verifyBtcAddress = (btcAddress) => {
    try {
      return BitcoinHelpers.Address.toScript(btcAddress)
    } catch (err) {
      console.log("Error parsing BTC address: ", btcAddress, err)
      return false
    }
  }

  handleBtcAddressChange = (evt) => {
    // TODO: Validate btc address
    const address = evt.target.value

    const isValid = this.verifyBtcAddress(address)
    const hasError = ! isValid

    this.setState({
      btcAddress: address,
      btcAddressIsValid: isValid,
      btcAddressHasError: hasError
    })
  }

  render() {
    const {
      depositAddress,
      depositAddressIsValid,
      depositAddressHasError,
      btcAddress,
      btcAddressIsValid,
      btcAddressHasError
    } = this.state

    return (
      <div className="redemption-start">
        <div className="page-top">
          <StatusIndicator>
            <TLogo height={100} width={100} />
          </StatusIndicator>
        </div>
        <div className="page-body">
          <div className="step">
            Step 1/6
          </div>
          <div className="title">
            Redeem bond
          </div>
          <hr />
          <div className="description">
          <div className={classnames("paste-field", { success: depositAddressIsValid, alert: depositAddressHasError })}>
              <label htmlFor="deposit-address">
                What was your TDT ID?
              </label>
              <input
                type="text"
                id="deposit-address"
                onChange={this.handleDepositAddressChange}
                value={depositAddress}
                placeholder="Enter TDT ID"
              />
              { depositAddressIsValid && <Check height="28px" width="28px" /> }
              { depositAddressHasError && <X height="28px" width="28px" /> }
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
              disabled={!depositAddressIsValid || !btcAddressIsValid}
              className="black"
              >
              Redeem
            </button>
          </div>
        </div>
      </div>
    )
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      saveAddresses
    },
    dispatch
  )
}

export default connect(
  null,
  mapDispatchToProps
)(Start)
