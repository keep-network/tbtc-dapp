import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { waitConfirmation } from '../actions'
import QRCode from 'qrcode.react'
import Peanut from './svgs/Peanut'

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
    let renderTop, renderTitle, step;

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

      step = 2
    } else {
      renderTop = (
        <div className="confirming">
          <Peanut width="250px" />
        </div>
      )

      renderTitle = (
        <div className="title">
          Confirming...
        </div>
      )

      step = 3
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
              Scan the QR code or click to copy the address below into your wallet
            </div>
            <div className="custodial-fee">
              <span className="custodial-fee-label">Custodial Fee: </span>
              .02 BTC*
            </div>
          </div>
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
    address: state.app.btcAddress,
    btcConfirming: state.app.btcConfirming
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
