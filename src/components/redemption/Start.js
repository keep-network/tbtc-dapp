import React, { Component } from 'react'

import history from '../../history'
import { requestPermission } from '../../lib/notifications'
import { withAccount } from '../../wrappers/web3'
import StatusIndicator from '../svgs/StatusIndicator'
import TLogo from '../svgs/tlogo'

class Start extends Component {

  componentDidMount() {
    requestPermission()
  }

  handleClickRedeem = (evt) => {
    evt.preventDefault()
    evt.stopPropagation()

    const { account } = this.props

    if (account) {
      history.push('/redeem/addresses')
    }
  }

  render() {
    const { account } = this.props

    return (
      <div className="start">
        <div className="page-top">
          <StatusIndicator purple>
            <TLogo height={100} width={100} />
          </StatusIndicator>
        </div>
        <div className="page-body">
          <div className="step">
            Step 1/4
          </div>
          <div className="title">
            Redeem bond
          </div>
          <hr />
          <div className="description">
            <p>Maecenas sed diam eget risus varius blandit sit amet non magna.  Maecenas sed diam eget risus varius blandit sit amet non magna.</p>
          </div>
          <div className='cta'>
            <button
              onClick={this.handleClickRedeem}
              disabled={typeof account === 'undefined'}
              className="black"
              >
              Redeem
            </button>
          </div>
        </div>
      </div>
    )
  }
}

export default withAccount(Start)
