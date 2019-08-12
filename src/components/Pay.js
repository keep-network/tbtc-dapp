import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { waitConfirmation } from '../actions'
import Peanut from './svgs/Peanut'

class Pay extends Component {
  state = {
    copied: false
  }

  componentDidMount() {
    const { waitConfirmation } = this.props

    // TODO: Uncomment when wait for confirmations is integrated to the UI.
    // This is just a temporary solution so the address page stays displayed.
    // waitConfirmation()
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
        <Peanut width="250px" />
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
              Scan the QR code or tap to pay, or copy the address below into your wallet
            </div>
            <div className="custodial-fee">
              <b>Custodial Fee:</b> .02 BTC*
            </div>
          </div>
          <div className="copy-address">
            <div className="address" onClick={this.copyAddress}>
              {address || '23980q9wufeu0q9832fy40cnw9qr3092n8q09ndq902n8jq390jnaewjdhfaoiweuhfoawiufhaowifuhaoiewuhfaowieufhaowieufhaoiseufhaowieuhfaoiweuhfaowieuhofiwesuahfoeiauhwefiauweh'}
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
    btcConfirming: !!state.app.btcConfirming
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
