import React, { Component } from 'react'

import history from '../history'
import { Web3Status } from './lib'
import { requestPermission } from '../lib/NotificationWrapper'
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
      history.push('/invoice')
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
            Begin a bond
          </div>
          <hr />
          <div className="description">
            Maecenas sed diam eget risus varius blandit sit amet non magna.  Maecenas sed diam eget risus varius blandit sit amet non magna.
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
