import React, { Component } from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { waitConfirmation } from '../actions'

class Pay extends Component {
  componentDidMount() {
    const { waitConfirmation } = this.props

    waitConfirmation()
  }

  render() {
    const { address, btcConfirming } = this.props
    let renderBody;

    if (!btcConfirming) {
      renderBody = (
        <div className="btc-address">
          {address}
        </div>
      )
    } else {
      renderBody = (
        <div className="confirming">
          Confirming...
        </div>
      )
    }

    return (
      <div className="pay">
        {renderBody}
      </div>
    )
  }
}


const mapStateToProps = (state, ownProps) => {
  return {
      address: state.app.btcAddress,
      btcConfirming: !!state.app.btcConfirming
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
      {
        waitConfirmation
      },
      dispatch
  )
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Pay)
