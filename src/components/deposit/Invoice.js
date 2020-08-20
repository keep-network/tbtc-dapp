import React, { useEffect } from "react"
import { bindActionCreators } from "redux"
import { connect } from "react-redux"
import PropTypes from "prop-types"

import { requestADeposit } from "../../actions"
import Description from "../lib/Description"
import StatusIndicator from "../svgs/StatusIndicator"

const Invoice = ({ requestADeposit, error }) => {
  useEffect(() => {
    requestADeposit()
  }, [requestADeposit])

  return (
    <div className="invoice">
      <div className="page-top">
        <StatusIndicator pulse />
      </div>
      <div className="page-body">
        <div className="step">Step 2/5</div>
        <div className="title">
          {error ? "Error initiating deposit" : "Initiating deposit"}
        </div>
        <hr />
        <Description error={error}>Initiating...</Description>
      </div>
    </div>
  )
}

Invoice.propTypes = {
  requestADeposit: PropTypes.func,
  error: PropTypes.string,
}

const mapStateToProps = (state) => ({
  error: state.deposit.requestDepositError,
})

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      requestADeposit,
    },
    dispatch
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(Invoice)
