import React from "react"
import { connect } from "react-redux"
import PropTypes from "prop-types"

import Description from "../lib/Description"
import StatusIndicator from "../svgs/StatusIndicator"
import RedemptionPage from "./RedemptionPage"

const Prove = ({ error }) => (
  <RedemptionPage className="prove">
    <div className="page-top">
      <StatusIndicator pulse />
    </div>
    <div className="page-body">
      <div className="step">Step 5/6</div>
      <div className="title">
        {error ? "Error proving redemption" : "Confirmed"}
      </div>
      <hr />
      <Description error={error}>
        Finally, we are submitting proof to the sidechain and get you your BTC.
      </Description>
    </div>
  </RedemptionPage>
)

Prove.propTypes = {
  error: PropTypes.string,
}

const mapStateToProps = (state, ownProps) => {
  return {
    provingRedemption: state.redemption.provingRedemption,
    error:
      state.redemption.proveRedemptionError ||
      state.deposit.stateRestorationError,
  }
}

export default connect(mapStateToProps)(Prove)
