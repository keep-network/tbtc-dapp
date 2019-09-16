import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { submitProof } from '../actions'
import Peanut from './svgs/Peanut'

class Prove extends Component {
  handleClickProve = (evt) => {
    evt.preventDefault()
    evt.stopPropagation()

    const { submitProof } = this.props

    submitProof()
  }

  render() {

    return (
      <div className="prove">
        <div className="page-top">
          <Peanut width="250px" />
        </div>
        <div className="page-body">
          <div className="step">
            Step 4/5
          </div>
          <div className="title">
            Received!
          </div>
          <hr />
          <div className="description">
            Finally, let’s submit proof to the sidechain and get you your tBTC.
          </div>
          <div className="cta">
            <a href="/pay" onClick={this.handleClickProve}>
              Submit Proof >>>
            </a>
          </div>
        </div>
      </div>
    )
  }
}


const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
      {
        submitProof
      },
      dispatch
  )
}

export default connect(
  () => ({}),
  mapDispatchToProps
)(Prove)
