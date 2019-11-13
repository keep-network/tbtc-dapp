import React, { Component } from 'react'
import classnames from 'classnames'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import StatusIndicator from '../svgs/StatusIndicator'
import TLogo from '../svgs/tlogo'
import Check from '../svgs/Check'
import X from '../svgs/X'
import { saveAddresses } from '../../actions'

class InputAddresses extends Component {

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
    // TODO: Validate deposit address
    const isValid = evt.target.value.length > 0 && true
    const hasError = evt.target.value.length > 0 && false

    this.setState({
      depositAddress: evt.target.value,
      depositAddressIsValid: isValid,
      depositAddressHasError: hasError
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
      depositAddress,
      depositAddressIsValid,
      depositAddressHasError,
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
            Step 2/5
          </div>
          <div className="title">
            Redeem bond
          </div>
          <hr />
          <div className="description">
          <div className={classnames("paste-field", { success: depositAddressIsValid, alert: depositAddressHasError })}>
              <label htmlFor="deposit-address">
                What was your deposit address?
              </label>
              <input
                type="text"
                id="deposit-address"
                onChange={this.handleDepositAddressChange}
                value={depositAddress}
                placeholder="Enter ETH Deposit Address"
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
              Confirm redemption
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
)(InputAddresses)
