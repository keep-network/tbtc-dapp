import React, { Component } from 'react'

import Wavy from '../svgs/Wavy'

class Confirming extends Component {
  render() {
    const { confirmations = 0, requiredConfirmations = 6 } = this.props

    return (
      <div className="confirming">
        <div className="page-top">
          <Wavy loading />
        </div>
        <div className="page-body">
          <div className="step">
            Step 3/4
          </div>
          <div className="title">
            {confirmations}/{requiredConfirmations} blocks confirmed...
          </div>
          <hr />
          <div className="description">
            <p>We’re waiting for the deposit signing group to sign and broadcast your Bitcoin transaction. You can follow along in a block explorer.</p>
          </div>
        </div>
      </div>
    )
  }
}

export default Confirming
