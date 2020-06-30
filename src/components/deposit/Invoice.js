import React, { useEffect } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { requestADeposit } from '../../actions'
import StatusIndicator from '../svgs/StatusIndicator'

const Invoice = ({ requestADeposit }) => {
  useEffect(() => {
    requestADeposit()
  }, [requestADeposit])

  return (
    <div className="invoice">
      <div className="page-top">
        <StatusIndicator pulse />
      </div>
      <div className="page-body">
        <div className="step">
          Step 2/5
        </div>
        <div className="title">
          Initiating deposit
        </div>
        <hr />
        <div className="description">
          Initiating...
        </div>
      </div>
    </div >
  )
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      requestADeposit
    },
    dispatch
  )
}

export default connect(
  null,
  mapDispatchToProps
)(Invoice)
