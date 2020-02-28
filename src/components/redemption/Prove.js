import React, { Component } from 'react'
import { connect } from 'react-redux'

import StatusIndicator from '../svgs/StatusIndicator'

class Prove extends Component {
  render() {
    const { proveRedemptionError } = this.props

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
            Finally, we are submitting proof to the sidechain and get you your BTC.
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

export default connect(
  mapStateToProps,
)(Prove)
