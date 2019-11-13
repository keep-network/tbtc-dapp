import React, { Component } from 'react'

import StatusIndicator from '../svgs/StatusIndicator'
import BTCLogo from '../svgs/btclogo'

class Congratulations extends Component {

  handleClickViewTransaction = (evt) => {
    evt.preventDefault()
    evt.stopPropagation()

    // TODO: Etherscan!
  }

  render() {

    return (
      <div className="congratulations">
        <div className="page-top">
          <StatusIndicator green>
            <BTCLogo height={100} width={100} />
          </StatusIndicator>
        </div>
        <div className="page-body">
          <div className="step">
            Step 6/6
          </div>
          <div className="title">
            Redemption Complete
          </div>
          <hr />
          <div className="description">
            <p>Enjoy your Bitcoin</p>
          </div>
          <div className='cta'>
            <button
              onClick={this.handleClickViewTransaction}
              className="black"
              >
              View your transaction
            </button>
          </div>
        </div>
      </div>
    )
  }
}

export default Congratulations
