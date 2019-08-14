import React, { Component } from 'react'

import history from '../history'
import { Web3Status } from './lib'

class Start extends Component {

  handleClickPay = (evt) => {
    evt.preventDefault()
    evt.stopPropagation()

    history.push('/invoice')
  }

  render() {
    return (
      <div className="start">
        <div className="page-top">
          <Web3Status />
        </div>
        <div className="page-body">
          <div className="step">
            Step 1/5
          </div>
          <div className="title">
            Begin a bond
          </div>
          <hr />
          <div className="description">
            To mint tBTC, we first need to initiate a bond. This is where we will send BTC.
          </div>
          <div className="cta">
            <a href="/invoice" onClick={this.handleClickPay}>
              Begin now >>>
            </a>
          </div>
        </div>
      </div>
    )
  }
}

export default Start
