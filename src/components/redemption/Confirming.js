import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import StatusIndicator from '../svgs/StatusIndicator'
import { pollForConfirmations } from '../../actions'

class Confirming extends Component {
  componentDidMount() {
    const { pollForConfirmations } = this.props

    pollForConfirmations()
  }

  handleClickButton = () => {
    const { txHash } = this.props

    window.open(
      `https://etherscan.io/tx/${txHash}`,
      '_blank'
    );
  }

  render() {
    const { confirmations = 0, requiredConfirmations = 6, pollForConfirmationsError } = this.props
console.log("WTF - PROPS: ", this.props)
    return (
      <div className="confirming">
        <div className="page-top">
          <StatusIndicator pulse />
        </div>
        <div className="page-body">
          <div className="step">
            Step 3/4
          </div>
          <div className="title">
            {confirmations}/{requiredConfirmations} blocks confirmed...
          </div>
          <hr />
          <div className="description">
            <p>We're waiting to confirm your transaction.</p>
            <button
              onClick={this.handleClickButton}
              className="black"
              >
              Follow along in block explorer
            </button>
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
  console.log("MAPPING: ", state)
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
      pollForConfirmations
    },
    dispatch
  )
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Confirming)
