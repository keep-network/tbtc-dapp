import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { submitProof } from '../../actions'
import StatusIndicator from '../svgs/StatusIndicator'

class Prove extends Component {
  handleClickProve = (evt) => {
    evt.preventDefault()
    evt.stopPropagation()

    const { submitProof } = this.props

    submitProof()
  }

  render() {
    const { provingDeposit, proveDepositError } = this.props

    return (
      <div className="prove">
        <div className="page-top">
          <StatusIndicator pulse />
        </div>
        <div className="page-body">
          <div className="step">
            Step 4/5
          </div>
          <div className="title">
            {
              provingDeposit
              ? 'Submitting Proof...'
              : proveDepositError
                ? 'Error submitting proof'
                : 'Received!'
            }
          </div>
          <hr />
          <div className="description">
            {
              provingDeposit
              ? 'Generating SVP and submitting to the sidechain...'
              : 'Finally, let’s submit proof to the sidechain and get you your tBTC.'
            }
          </div>
          <div className={`cta ${provingDeposit ? 'disabled' : ''}`}>
            <a href="/deposit/congratulations" onClick={this.handleClickProve}>
              Submit Proof >>>
            </a>
          </div>
          <div className="error">
            { proveDepositError }
          </div>
        </div>
      </div>
    )
  }
}


const mapStateToProps = (state, ownProps) => {
  return {
      provingDeposit: state.app.provingDeposit,
      proveDepositError: state.app.proveDepositError
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
      {
        submitProof
      },
      dispatch
  )
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Prove)
