import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import StatusIndicator from '../svgs/StatusIndicator'
import { broadcastTransaction } from '../../actions'

class Confirming extends Component {
  componentDidMount() {
    const { broadcastTransaction } = this.props

    broadcastTransaction()
  }

  handleClickButton = () => {
    const { txHash } = this.props

    window.open(
      `https://blockstream.info/tx/${txHash}`,
      '_blank'
    );
  }

  render() {
    const {
      confirmations,
      requiredConfirmations,
      pollForConfirmationsError,
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
            {
              confirmations
              ? `${confirmations}/${requiredConfirmations} blocks confirmed...`
              : 'Broadcasting Transaction'
            }
          </div>
          <hr />
          <div className="description">
            {
              confirmations
              ? <p>We're waiting to confirm your transaction.</p>
              : <p>Broadcasting your transaction...</p>
            }
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
              pollForConfirmationsError
              ? <div className="error">
                  { pollForConfirmationsError }
                </div>
              : ''
            }
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    txHash: state.redemption.txHash,
    confirmations: state.redemption.confirmations,
    requiredConfirmations: state.redemption.requiredConfirmations,
    pollForConfirmationsError: state.redemption.pollForConfirmationsError
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      broadcastTransaction
    },
    dispatch
  )
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Confirming)
