import React, { Component } from 'react'

import Wavy from '../svgs/Wavy'

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
          <Wavy btcLogo />
        </div>
        <div className="page-body">
          <div className="step">
            Step 4/4
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
