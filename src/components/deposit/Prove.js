import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { useParams, withRouter } from 'react-router-dom'

import { submitDepositProof } from '../../actions'
import StatusIndicator from '../svgs/StatusIndicator'

function Prove(props) {
  const params = useParams()
  return <ProveComponent {...props} address={props.address || params.address} />
}

class ProveComponent extends Component {
  handleClickProve = (evt) => {
    evt.preventDefault()
    evt.stopPropagation()

    const { submitDepositProof } = this.props

    submitDepositProof()
  }

  render() {
    const { provingDeposit, proveDepositError } = this.props

    return (
      <div className="prove">
        <div className="page-top">
          <StatusIndicator pulse />
        </div>
        <div className="page-body">
          <div className="step">
            Step 5/6
          </div>
          <div className="title">
            {
              provingDeposit
              ? 'Submitting Proof...'
              : proveDepositError
                ? 'Error submitting proof'
                : 'Received!'
            }
          </div>
          <hr />
          <div className="description">
            {
              provingDeposit
              ? 'Generating SPV and submitting to the sidechain...'
              : 'Finally, let’s submit proof to the sidechain and get you your tBTC.'
            }
          </div>
          <div className={`cta ${provingDeposit ? 'disabled' : ''}`}>
            <a href="/deposit/congratulations" onClick={this.handleClickProve}>
              Submit Proof >>>
            </a>
          </div>
          <div className="error">
            { proveDepositError }
          </div>
        </div>
      </div>
    )
  }
}


const mapStateToProps = (state, ownProps) => {
  return {
      provingDeposit: state.deposit.provingDeposit,
      proveDepositError: state.deposit.proveDepositError
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
      {
        submitDepositProof
      },
      dispatch
  )
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Prove))
