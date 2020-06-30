import React, { useEffect } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import StatusIndicator from '../svgs/StatusIndicator'
import { resumeRedemption } from '../../actions'

const Signing = ({ resumeRedemption, redemptionInProgress }) => {
  useEffect(() => {
    if (!redemptionInProgress) {
      resumeRedemption()
    }
  }, [resumeRedemption, redemptionInProgress])

  return (
    <div className="confirming">
      <div className="page-top">
        <StatusIndicator pulse />
      </div>
      <div className="page-body">
        <div className="step">
          Step 3/6
        </div>
        <div className="title">
          Waiting on signing group
        </div>
        <hr />
        <div className="description">
          <p>We’re waiting for the deposit signing group to build and sign your Bitcoin transaction.</p>
        </div>
      </div>
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    redemptionInProgress: !!state.redemption.redemption
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ resumeRedemption }, dispatch)
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Signing)
