import React, { Component } from 'react'
import { connect } from 'react-redux'

import StatusIndicator from '../svgs/StatusIndicator'

class Confirming extends Component {
  handleClickButton = () => {
    const { txHash, btcNetwork } = this.props

    window.open(
      `https://blockstream.info/${btcNetwork === 'testnet' ? 'testnet/' : ''}tx/${txHash}`,
      '_blank'
    );
  }

  render() {
    const {
      error,
      txHash
    } = this.props

    return (
      <div className="confirming">
        <div className="page-top">
          <StatusIndicator pulse />
        </div>
        <div className="page-body">
          <div className="step">
            Step 4/6
          </div>
          <div className="title">
            { error ? 'Error confirming transaction' : 'Confirming...' }
          </div>
          <hr />
          <div className="description">
            <p>We're waiting to confirm your transaction.</p>
            {
              txHash
              ? <button
                  onClick={this.handleClickButton}
                  className="black"
                  >
                  Follow along in block explorer
                </button>
              : ''
            }
            {
              error
              ? <div className="error">
                  { error }
                </div>
              : ''
            }
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    txHash: state.redemption.txHash,
    error: state.redemption.pollForConfirmationsError,
    btcNetwork: state.redemption.btcNetwork,
  }
}

export default connect(
  mapStateToProps,
)(Confirming)
