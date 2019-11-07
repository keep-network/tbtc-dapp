import React, { Component } from 'react'

import StatusIndicator from '../svgs/StatusIndicator'

class Confirming extends Component {
  componentDidMount() {
    // TODO: Kick off call to Confirming Saga which will poll for confirmations and transfer to the Congratulations page
  }

  handleClickButton = () => {
    // TODO: This gets set in global state by Signing saga
    const { txHash = 'TODO' } = this.props

    window.open(
      `https://etherscan.io/tx/${txHash}`,
      '_blank'
    );
  }

  render() {
    const { confirmations = 0, requiredConfirmations = 6 } = this.props

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
            {confirmations}/{requiredConfirmations} blocks confirmed...
          </div>
          <hr />
          <div className="description">
            <p>We're waiting to confirm your transaction.</p>
            <button
              onClick={this.handleClickButton}
              className="black"
              >
              Follow along in block explorer
            </button>
          </div>
        </div>
      </div>
    )
  }
}

export default Confirming
