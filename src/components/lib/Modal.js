import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { closeModal } from '../../actions'

const Modal = props => {
  const { render, isOpen, closeModal } = props

  return (
    <div className={`modal ${isOpen ? 'open' : 'closed'}`}>
      <div className="modal-body">
        <div className="close">
          <div className="x" onClick={closeModal}>&#9587;</div>
        </div>
        { render && render()}
      </div>
    </div>
  )
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      closeModal
    },
    dispatch
  )
}

export default connect(
  () => ({}),   
  mapDispatchToProps
)(Modal)