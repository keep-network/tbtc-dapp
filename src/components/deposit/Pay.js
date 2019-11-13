import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { waitConfirmation } from '../../actions'
import QRCode from 'qrcode.react'
import StatusIndicator from '../svgs/StatusIndicator'

class Pay extends Component {
  state = {
    copied: false
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
    const { address, btcConfirming } = this.props
    const { copied } = this.state
    let renderTop, renderTitle, renderCopyAddress, descriptionText, step;

    if (!btcConfirming) {
      renderTop = (
        <div className="qr-code">
          <QRCode
            value={address}
            renderAs="svg"
            size={225} />
        </div>
      )

      renderTitle = (
        <div className="title">
          Pay: 1 BTC
        </div>
      )

      descriptionText =  'Scan the QR code or click to copy the address below into your wallet.'

      step = 2

      renderCopyAddress = (
        <div className="copy-address">
          <div className="address" onClick={this.copyAddress}>
            {address}
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
              <span className="custodial-fee-label">Custodial Fee: </span>
              .005 BTC*
            </div>
          </div>
          { renderCopyAddress }
        </div>
        <textarea
          className="hidden-copy-field"
          ref={textarea => this.hiddenCopyField = textarea}
          defaultValue={address || ''} />
      </div>
    )
  }
}


const mapStateToProps = (state, ownProps) => {
  return {
    address: state.deposit.btcAddress,
    btcConfirming: state.deposit.btcConfirming
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
