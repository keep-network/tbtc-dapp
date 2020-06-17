import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { autoSubmitDepositProof } from '../../actions'
import QRCode from 'qrcode.react'
import { useParams } from "react-router-dom"

import { BitcoinHelpers } from '@keep-network/tbtc.js'

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

  componentDidMount() {
    const { autoSubmitDepositProof } = this.props

    autoSubmitDepositProof()
  }

  copyAddress = (evt) => {
    this.hiddenCopyField.select()
    document.execCommand('copy')
    this.hiddenCopyField.blur()
    this.setState({ copied: true })
  }

  render() {
    const { btcAddress, lotInSatoshis, signerFeeInSatoshis } = this.props
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
          <div className="qr-code">
            <QRCode
              value={btcURL}
              renderAs="svg"
              size={225} />
          </div>
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
            <div className="address" onClick={this.copyAddress}>
              {btcAddress}
            </div>
            {
              copied
              ? <div className="copied">Copied!</div>
              : ''
            }
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


const mapStateToProps = (state, ownProps) => {
  return {
    btcAddress: state.deposit.btcAddress,
    depositAddress: state.deposit.depositAddress,
    lotInSatoshis: state.deposit.lotInSatoshis,
    signerFeeInSatoshis: state.deposit.signerFeeInSatoshis,
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      autoSubmitDepositProof
    },
    dispatch
  )
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Pay)
