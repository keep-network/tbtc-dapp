import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { waitConfirmation } from '../../actions'
import QRCode from 'qrcode.react'
import StatusIndicator from '../svgs/StatusIndicator'
import { useParams } from "react-router-dom"

function Pay(props) {
  const params = useParams()
  return <PayComponent {...props} address={props.address || params.address} />
}

class PayComponent extends Component {
  state = {
    copied: false,
    deposit: {
      depositAddress: this.props.address
    }
  }

  componentDidMount() {
    const { waitConfirmation } = this.props

    waitConfirmation()
  }

  copyAddress = (evt) => {
    this.hiddenCopyField.select()
    document.execCommand('copy')
    this.hiddenCopyField.blur()
    this.setState({ copied: true })
  }

  render() {
    const { btcAddress, btcConfirming, lotInBtc, signerFeeInBtc } = this.props

    const { copied } = this.state
    let renderTop, renderTitle, renderCopyAddress, descriptionText, step;

    const btcAmount = lotInBtc.toString()
    const signerFee = signerFeeInBtc.toString()
    const btcURL =
      `bitcoin:${btcAddress}?amount=${btcAmount}&label=Single-Use+tBTC+Deposit+Wallet`

    if (!btcConfirming) {
      renderTop = (
        <div className="qr-code">
          <QRCode
            value={btcURL}
            renderAs="svg"
            size={225} />
        </div>
      )

      renderTitle = (
        <div className="title">
          Pay: {btcAmount} BTC
        </div>
      )

      descriptionText =  'Scan the QR code or click to copy the address below into your wallet.'

      step = 2

      renderCopyAddress = (
        <div className="copy-address">
          <div className="address" onClick={this.copyAddress}>
            {btcAddress}
          </div>
          {
            copied
            ? <div className="copied">Copied!</div>
            : ''
          }
        </div>
      )
    } else {
      renderTop = (
        <StatusIndicator pulse />
      )

      renderTitle = (
        <div className="title">
          Confirming...
        </div>
      )

      descriptionText =  (
        <span>
          Waiting for transaction confirmations. We’ll send you a notification when your TBTC is ready to be minted.
          <p><i>A watched block never boils.</i></p>
        </span>
      )

      step = 3

      renderCopyAddress = ''
    }

    return (
      <div className="pay">
        <div className="page-top">
          {renderTop}
        </div>
        <div className="page-body">
          <div className="step">
            Step {step}/5
          </div>
          {renderTitle}
          <hr />
          <div className="description">
            <div>
              {descriptionText}
            </div>
            <div className="custodial-fee">
              <span className="custodial-fee-label">Signer Fee: </span>
              {signerFee} BTC*
            </div>
          </div>
          { renderCopyAddress }
        </div>
        <textarea
          className="hidden-copy-field"
          ref={textarea => this.hiddenCopyField = textarea}
          defaultValue={btcAddress || ''} />
      </div>
    )
  }
}


const mapStateToProps = (state, ownProps) => {
  return {
    btcAddress: state.deposit.btcAddress,
    depositAddress: state.deposit.depositAddress,
    btcConfirming: state.deposit.btcConfirming,
    lotInBtc: state.deposit.lotInBtc,
    signerFeeInBtc: state.deposit.signerFeeInBtc,
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      waitConfirmation
    },
    dispatch
  )
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Pay)
