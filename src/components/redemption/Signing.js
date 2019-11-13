import React, { Component } from 'react'

import StatusIndicator from '../svgs/StatusIndicator'

class Signing extends Component {
  componentDidMount() {
    // TODO: Kick off call to Signing Saga, which will transfer you to the Confirming page
  }

  render() {
    return (
      <div className="confirming">
        <div className="page-top">
          <StatusIndicator pulse />
        </div>
        <div className="page-body">
          <div className="step">
            Step 3/4
          </div>
          <div className="title">
            Waiting on signing group
          </div>
          <hr />
          <div className="description">
            <p>We’re waiting for the deposit signing group to sign and broadcast your Bitcoin transaction.</p>
          </div>
        </div>
      </div>
    )
  }
}

export default Signing
