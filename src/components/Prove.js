import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { submitProof, openModal, closeModal } from '../actions'
import Peanut from './svgs/Peanut'

class Prove extends Component {

  handleClickProve = (evt) => {
    evt.preventDefault()
    evt.stopPropagation()

    const { submitProof } = this.props

    submitProof()
  }

  handleOpenModal = (evt) => {
    evt.preventDefault()
    evt.stopPropagation()

    const { openModal, closeModal } = this.props

    const renderModalBody = () => {
      return (
        <div className="prove-modal">
          <div className="modal-left">
            <div className="title">
              Wait just a second!
            </div>
            <hr />
            <div className="description">
              You must submit proof of your deposit on chain or lose your funds.
            </div>
            <div className="cta">
              <a href="/congratulations" onClick={this.handleClickProve}>
                Submit Proof
              </a>
            </div>
            <div className="cti" onClick={closeModal}>
              Lose 1 BTC
            </div>
          </div>
          <div className="modal-right">
            <div className="peanuts">
              <Peanut width="360"/>
              <Peanut width="360"/>
              <Peanut width="360"/>
            </div>
          </div>
        </div>
      )
    }

    openModal(renderModalBody)
  }

  render() {

    return (
      <div className="prove">
        <div className="page-left">
          TODO: SOMETHING HERE
        </div>
        <div className="page-right">
          <div className="step">
            Step 3/5
          </div>
          <div className="title">
            Received!
          </div>
          <hr />
          <div className="description">
            Finally, let’s submit proof to the sidechain and get you your tBTC.
          </div>
          <div className="cta">
            <a href="/pay" onClick={this.handleOpenModal}>
              Begin now >>>
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
        submitProof,
        openModal,
        closeModal
      },
      dispatch
  )
}

export default connect(
  () => ({}),
  mapDispatchToProps
)(Prove)
