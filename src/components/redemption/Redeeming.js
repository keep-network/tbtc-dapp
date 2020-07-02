import React, { useEffect } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { useParams } from 'react-router-dom'

import StatusIndicator from '../svgs/StatusIndicator'
import { requestRedemption } from '../../actions'

function Redeeming(props) {
  const params = useParams()
  return <RedeemingComponent {...props} address={props.address || params.address} />
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
        <div className="step">
          Step 2/6
        </div>
        <div className="title">
          { error ? 'Error redeeming bond' : 'Redeeming...'}
        </div>
        <hr />
        <div className="description">
          <p>We’re waiting for you to confirm invoice details in your Wallet.</p>
        </div>
        <div className="error">
          { error }
        </div>
      </div>
    </div>
  )
}

const mapStateToProps = (state, ownProps) => ({
  error: state.redemption.requestRedemptionError,
})

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
        requestRedemption
    },
    dispatch
  )
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Redeeming)

