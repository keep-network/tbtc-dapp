import React from "react"
import { connect } from "react-redux"
import PropTypes from "prop-types"

import Description from "../lib/Description"
import StatusIndicator from "../svgs/StatusIndicator"
import RedemptionPage from "./RedemptionPage"

const Signing = ({ error }) => {
  return (
    <RedemptionPage className="confirming">
      <div className="page-top">
        <StatusIndicator pulse />
      </div>
      <div className="page-body">
        <div className="step">Step 3/6</div>
        <div className="title">
          {error
            ? "Error signing your transaction"
            : "Waiting on signing group"}
        </div>
        <hr />
        <Description error={error}>
          <p>
            We’re waiting for the deposit signing group to build and sign your
            Bitcoin transaction.
          </p>
        </Description>
      </div>
    </RedemptionPage>
  )
}

Signing.propTypes = {
  error: PropTypes.string,
}

const mapStateToProps = (state) => ({
  error: state.redemption.signTxError || state.deposit.stateRestorationError,
})

export default connect(mapStateToProps)(Signing)
