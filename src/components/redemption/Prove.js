import React from 'react'
import { connect } from 'react-redux'

import Description from "../lib/Description"
import StatusIndicator from '../svgs/StatusIndicator'

const Prove = ({ error }) => (
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
      <Description error={error}>
        Finally, we are submitting proof to the sidechain and get you your BTC.
      </Description>
    </div>
  </div>
)

const mapStateToProps = (state, ownProps) => {
  return {
      provingRedemption: state.redemption.provingRedemption,
      error: state.redemption.proveRedemptionError
  }
}

export default connect(
  mapStateToProps,
)(Prove)
