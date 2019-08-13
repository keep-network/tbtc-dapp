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
        </div>
      </div >
    )
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
  () => ({}),
  mapDispatchToProps
)(Invoice)
