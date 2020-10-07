import React, { Component } from "react"
import { connect } from "react-redux"
import { useParams, withRouter } from "react-router-dom"
import PropTypes from "prop-types"

import Description from "../lib/Description"
import StatusIndicator from "../svgs/StatusIndicator"
import DepositPage from "./DepositPage"

function Prove(props) {
  const params = useParams()
  return <ProveComponent {...props} address={props.address || params.address} />
}

Prove.propTypes = {
  address: PropTypes.string,
}

class ProveComponent extends Component {
  handleClickProve = (evt) => {
    evt.preventDefault()
    evt.stopPropagation()
  }

  render() {
    const { provingDeposit, error } = this.props

    return (
      <DepositPage className="prove">
        <div className="page-top">
          <StatusIndicator pulse />
        </div>
        <div className="page-body">
          <div className="step">Step 4/5</div>
          <div className="title">
            {provingDeposit
              ? "Submitting Proof..."
              : error
              ? "Error submitting proof"
              : "Received!"}
          </div>
          <hr />
          <Description error={error}>
            {provingDeposit
              ? "Generating SPV and submitting to the sidechain..."
              : "Finally, let’s submit proof to the sidechain and get you your TBTC."}
          </Description>
        </div>
      </DepositPage>
    )
  }
}

ProveComponent.propTypes = {
  provingDeposit: PropTypes.bool,
  error: PropTypes.string,
  address: PropTypes.string,
}

const mapStateToProps = (state, ownProps) => {
  return {
    provingDeposit: state.deposit.provingDeposit,
    error:
      state.deposit.proveDepositError || state.deposit.stateRestorationError,
  }
}

export default withRouter(connect(mapStateToProps)(Prove))
