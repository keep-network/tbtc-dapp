import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { requestADeposit } from '../../actions'
import Peanut from '../svgs/Peanut'

class Invoice extends Component {

  componentDidMount() {
    const { requestADeposit } = this.props

    requestADeposit()
  }

  render() {
    const { status } = this.props
    let statusText

    if(status === 1) {
      statusText = 'Initiating...'
    } else if(status === 2) {
      statusText = 'Generating BTC address...'
    } else if(status === 3) {
      statusText = 'Fetching BTC address...'
    }

    return (
      <div className="invoice">
        <div className="page-top">
          <div className="building">
            <Peanut width="250px" loading={true} />
          </div>
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
