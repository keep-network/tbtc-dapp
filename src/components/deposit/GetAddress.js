import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'

import Description from "../lib/Description"
import StatusIndicator from '../svgs/StatusIndicator'

const GetAddress = ({ status, error }) => {
  const [statusText, setStatusText] = useState('Generating BTC address...')
  useEffect(() => {
    if (status === 3) {
      setStatusText('Fetching BTC address...')
    }
  }, [status])

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
        <Description error={error}>
          {statusText}
        </Description>
      </div>
    </div >
  )
}

const mapStateToProps = (state, ownProps) => {
  return {
    status: state.deposit.invoiceStatus,
    error: state.deposit.btcAddressError,
  }
}

export default connect(
  mapStateToProps,
  null,
)(GetAddress)
