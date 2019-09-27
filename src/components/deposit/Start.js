import React, { Component } from 'react'

import history from '../../history'
import { requestPermission } from '../../lib/notifications'
import { withAccount } from '../../wrappers/web3'
import Wavy from '../svgs/Wavy'

class Start extends Component {

  componentDidMount() {
    requestPermission()
  }

  handleClickPay = (evt) => {
    evt.preventDefault()
    evt.stopPropagation()

    const { account } = this.props

    if (account) {
      history.push('/invoice')
    }
  }

  render() {
    const { account } = this.props

    return (
      <div className="start">
        <div className="page-top">
          <Wavy btcLogo />
        </div>
        <div className="page-body">
          <div className="step">
            Step 1/5
          </div>
          <div className="title">
            Initiate a deposit
          </div>
          <hr />
          <div className="description">
            <p>To mint tBTC, we first need to initiate a deposit. This is where we will send BTC.</p>
            <p>This should take less than 1 minute.</p>
          </div>
          <div className={`cta ${!account ? 'disabled' : ''}`}>
            <a href="/invoice" onClick={this.handleClickPay}>
              Begin now >>>
            </a>
          </div>
        </div>
      </div>
    )
  }
}

export default withAccount(Start)
