import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { requestADeposit } from '../actions'

class Start extends Component {

  handleClickPay = (evt) => {
    const { requestADeposit } = this.props

    requestADeposit()
  }

  render() {
    return (
      <div className="start">
        <button onClick={this.handleClickPay}>Pay</button>
      </div>
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
)(Start)
