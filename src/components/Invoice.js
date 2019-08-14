import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { requestADeposit } from '../actions'
import Peanut from './svgs/Peanut'

class Invoice extends Component {

  componentDidMount() {
    const { requestADeposit } = this.props

    requestADeposit()
  }

  render() {
    const { status } = this.props
    let statusText

    if(status === 1) {
      statusText = 'Waiting on transaction 1/2'
    } else if(status === 2) {
      statusText = 'Retrieving BTC address...'
    } else if(status === 3) {
      statusText = 'Waiting on transaction 2/2'
    }

    return (
      <div className="invoice">
        <div className="page-top">
          <div className="building">
            <Peanut width="250px" />
          </div>
        </div>
        <div className="page-body">
          <div className="step">
            Step 2/5
          </div>
          <div className="title">
            Building invoice
          </div>
          <hr />
          <div className="description">
            {statusText}
          </div>
          <hr />
        </div>
      </div >
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    status: state.app.invoiceStatus
  }
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
  mapStateToProps,
  mapDispatchToProps
)(Invoice)
