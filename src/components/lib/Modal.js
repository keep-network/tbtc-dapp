import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { closeModal } from '../../actions'

const Modal = props => {
  const { renderContent, isOpen, closeModal } = props

  return (
    <div className={`modal ${(isOpen && renderContent) ? 'open' : 'closed'}`}>
      <div className="modal-body">
        <div className="close">
          <div className="x" onClick={closeModal}>&#9587;</div>
        </div>
        { typeof renderContent === 'function' && renderContent()}
      </div>
    </div>
  )
}

const mapStateToProps = (state, ownProps) => {
  return {
      isOpen: state.modal.isOpen,
      renderContent: state.modal.renderContent
  }
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
  mapStateToProps,   
  mapDispatchToProps
)(Modal)