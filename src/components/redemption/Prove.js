import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { submitRedemptionProof } from '../../actions'
import StatusIndicator from '../svgs/StatusIndicator'

class Prove extends Component {
  handleClickProve = (evt) => {
    evt.preventDefault()
    evt.stopPropagation()

    const { submitRedemptionProof } = this.props

    submitRedemptionProof()
  }

  render() {
    const { provingRedemption, proveRedemptionError } = this.props

    return (
      <div className="prove">
        <div className="page-top">
          <StatusIndicator pulse />
        </div>
        <div className="page-body">
          <div className="step">
            Step 5/6
          </div>
          <div className="title">
            Confirmed
          </div>
          <hr />
          <div className="description">
            Finally, let’s submit proof to the sidechain and get you your BTC.
          </div>
          <div className="cta">
            <button
              onClick={this.handleClickProve}
              disabled={provingRedemption}
              className="black"
              >
              Redeem BTC
            </button>
          </div>
          <div className="error">
            { proveRedemptionError }
          </div>
        </div>
      </div>
    )
  }
}


const mapStateToProps = (state, ownProps) => {
  return {
      provingRedemption: state.redemption.provingRedemption,
      proveRedemptionError: state.redemption.proveRedemptionError
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
      {
        submitRedemptionProof
      },
      dispatch
  )
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Prove)
