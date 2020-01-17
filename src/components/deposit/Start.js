import React, { Component } from 'react'

import history from '../../history'
import { requestPermission } from '../../lib/notifications'
import { withAccount } from '../../wrappers/web3'
import StatusIndicator from '../svgs/StatusIndicator'
import BTCLogo from '../svgs/btclogo'

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

  render() {
    const { account } = this.props

    return (
      <div className="deposit-start">
        <div className="page-top">
          <StatusIndicator green>
            <BTCLogo height={100} width={100} />
          </StatusIndicator>
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
          <div className='cta'>
            <button
              onClick={this.handleClickPay}
              disabled={typeof account === 'undefined'}
              className="black"
              >
              Begin now
            </button>
          </div>
        </div>
      </div>
    )
  }
}

export default withAccount(Start)
