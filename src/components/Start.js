import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { requestADeposit } from '../actions'
import Peanut from './svgs/Peanut'

class Start extends Component {

  handleClickPay = (evt) => {
    evt.preventDefault()
    evt.stopPropagation()

    const { requestADeposit } = this.props

    requestADeposit()
  }

  render() {
    return (
      <div className="start">
        <div className="page-left">
          <div className="peanuts">
            <Peanut width="900"/>
            <Peanut width="900"/>
            <Peanut width="900"/>
          </div>
        </div>
        <div className="page-right">
          <div className="step">
            Step 1/5
          </div>
          <div className="title">
            Begin a bond
          </div>
          <hr />
          <div className="description">
            Maecenas sed diam eget risus varius blandit sit amet non magna.  Maecenas sed diam eget risus varius blandit sit amet non magna.
          </div>
          <div className="cta">
            <a href="/pay" onClick={this.handleClickPay}>
              Begin now >>>
            </a>
          </div>
          <div className="metamask">
            FYI: You will need a web3-enabled wallet, we suggest <a href="https://metamask.io/" target="_blank">Metamask</a>.
          </div>
        </div>
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
