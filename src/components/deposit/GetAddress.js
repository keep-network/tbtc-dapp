import React, { useState, useEffect } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import StatusIndicator from '../svgs/StatusIndicator'
import { getBitcoinAddress } from '../../actions'

const GetAddress = ({ status, getBitcoinAddress }) => {
  useEffect(() => {
    getBitcoinAddress()
  }, [getBitcoinAddress])

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
        <div className="description">
          {statusText}
        </div>
      </div>
    </div >
  )
}

const mapStateToProps = (state, ownProps) => {
  return {
    status: state.deposit.invoiceStatus
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
  {
    getBitcoinAddress
  },
  dispatch
  )
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GetAddress)
