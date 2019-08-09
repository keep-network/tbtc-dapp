import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { waitConfirmation } from '../actions'
import Loading from './svgs/Loading'

class Pay extends Component {
  state = {
    copied: false
  }

  componentDidMount() {
    const { waitConfirmation } = this.props

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
    let renderLeft, renderTitle;

    if (btcConfirming) {
      renderLeft = (
        <div className="qr-code">
          TODO: QR CODE
        </div>
      )

      renderTitle = (
        <div className="title">
          Pay:
          <br />
          1 BTC
        </div>
      )
    } else {
      renderLeft = (
        <div className="confirming">
          <Loading width="500px" />
        </div>
      )

        renderTitle = (
          <div className="title">
            Confirming...
          </div>
      )
    }

    return (
      <div className="pay">
        <div className="page-left">
          {renderLeft}
        </div>
        <div className="page-right">
          <div className="step">
            Step 2/5
          </div>
          {renderTitle}
          <hr />
          <div className="description">
            Scan the QR code or tap to pay, or copy the address below into your wallet
          </div>
          <div className="custodial-fee">
            <b>Custodial Fee:</b> .02 BTC*
          </div>
          <div className="copy-address">
            <div className="address" onClick={this.copyAddress}>
              {address || 'paoifjp3a98rjpawicj3oinacowijndoijp0awe98ur984759283764529874y5qui4oqyuoq'}
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
