import React, { useEffect } from "react"
import { bindActionCreators } from "redux"
import { connect } from "react-redux"
import { useParams } from "react-router-dom"
import PropTypes from "prop-types"

import Description from "../lib/Description"
import StatusIndicator from "../svgs/StatusIndicator"
import { requestRedemption } from "../../actions"

function Redeeming(props) {
  const params = useParams()
  return (
    <RedeemingComponent {...props} address={props.address || params.address} />
  )
}

Redeeming.propTypes = {
  address: PropTypes.string,
}

const RedeemingComponent = ({ requestRedemption, error }) => {
  useEffect(() => {
    requestRedemption()
  }, [requestRedemption])

  return (
    <div className="confirming">
      <div className="page-top">
        <StatusIndicator pulse />
      </div>
      <div className="page-body">
        <div className="step">Step 2/6</div>
        <div className="title">
          {error ? "Error redeeming bond" : "Redeeming..."}
        </div>
        <hr />
        <Description error={error}>
          <p>
            We’re waiting for you to confirm invoice details in your Wallet.
          </p>
        </Description>
      </div>
    </div>
  )
}

RedeemingComponent.propTypes = {
  requestRedemption: PropTypes.func,
  error: PropTypes.string,
}

const mapStateToProps = (state, ownProps) => ({
  error:
    state.redemption.requestRedemptionError ||
    state.deposit.stateRestorationError,
})

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      requestRedemption,
    },
    dispatch
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(Redeeming)
