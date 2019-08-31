import React, { Component } from 'react'

import history from '../history'
import { Web3Status } from './lib'
import { requestPermission } from '../lib/notifications'
import { withAccount } from '../wrappers/web3'

class Start extends Component {

  componentDidMount() {
    requestPermission()
  }

  handleClickPay = (evt) => {
    evt.preventDefault()
    evt.stopPropagation()

    const { account } = this.props

    if (account) {
      history.push('/deposit/invoice')
    }
  }

  handleClickInitialize = (evt) => {
    evt.preventDefault()
    evt.stopPropagation()

    const { account } = this.props

    if (account) {
      history.push('/redemption/initialize')
    }
  }


  render() {
    const { account } = this.props

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
            Initiate a deposit or redeem your BTC
          </div>
          <hr />
          <div className="row">
            <div className="row-item">
              <div className="description">
                <p>To mint tBTC, we first need to initiate a deposit. This is where we will send BTC.</p>
              </div>
              <div className={`cta ${!account ? 'disabled' : ''}`}>
                <a href="/deposit/invoice" onClick={this.handleClickPay}>
                  Initiate a deposit >>>
                </a>
              </div>
            </div>
            <div className="row-item">
              <div className="description">
                <p>To redeem your BTC, you need to send 1 tBTC to the contract address you saved during the deposit.</p>
              </div>
              <div className={`cta ${!account ? 'disabled' : ''}`}>
                <a href="/redemption/initialize" onClick={this.handleClickInitialize}>
                  Redeem your BTC >>>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default withAccount(Start)
