import React, { Component } from 'react'
import { connect } from 'react-redux'

import QRCode from 'qrcode.react'
import { useParams } from "react-router-dom"

import { BitcoinHelpers } from '@keep-network/tbtc.js'

import StatusIndicator from '../svgs/StatusIndicator'
import QRCodeIcon from '../svgs/QRCodeIcon'

import BigNumber from "bignumber.js"
BigNumber.set({ DECIMAL_PLACES: 8 })

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

  copyAddress = (evt) => {
    this.hiddenCopyField.select()
    document.execCommand('copy')
    this.hiddenCopyField.blur()
    this.setState({ copied: true })
  }

  render() {
    const { btcAddress, lotInSatoshis, signerFeeInSatoshis, error } = this.props
    const lotInBtc = (new BigNumber(lotInSatoshis.toString())).div(BitcoinHelpers.satoshisPerBtc.toString())
    const signerFeeInBtc = (new BigNumber(signerFeeInSatoshis.toString())).div(BitcoinHelpers.satoshisPerBtc.toString())

    const { copied } = this.state

    const btcAmount = lotInBtc.toString()
    const signerFee = signerFeeInBtc.toString()
    const btcURL =
      `bitcoin:${btcAddress}?amount=${btcAmount}&label=Single-Use+tBTC+Deposit+Wallet`

    return (
      <div className="pay">
        <div className="page-top">
          <StatusIndicator />
        </div>
        <div className="page-body">
          <div className="step">
            Step 2/5
          </div>
          <div className="title">
            Pay: {btcAmount} BTC
          </div>
          <hr />
          <div className="description">
            <div>
              Scan the QR code or click to copy the address below into your wallet.
            </div>
            <div className="custodial-fee">
              <span className="custodial-fee-label">Signer Fee: </span>
              {signerFee} BTC*
            </div>
          </div>
          <div className="copy-address">
            <div className="qr-code-wrapper">
              <QRCodeIcon />
              <div className="qr-code">
                <QRCode
                  value={btcURL}
                  renderAs="svg"
                  size={225} />
              </div>
            </div>
            <div className="address" onClick={this.copyAddress}>
              {btcAddress}
            </div>
            <div className="copy-text">
              { copied ? 'copied!' : 'copy' }
            </div>
          </div>
          <div className="error">
            { error }
          </div>
        </div>
        <textarea
          className="hidden-copy-field"
          ref={textarea => this.hiddenCopyField = textarea}
          defaultValue={btcAddress || ''} />
      </div>
    )
  }
}


const mapStateToProps = (state) => {
  return {
    btcAddress: state.deposit.btcAddress,
    depositAddress: state.deposit.depositAddress,
    lotInSatoshis: state.deposit.lotInSatoshis,
    signerFeeInSatoshis: state.deposit.signerFeeInSatoshis,
    error: state.deposit.btcTxError,
  }
}

export default connect(
  mapStateToProps,
  null
)(Pay)
