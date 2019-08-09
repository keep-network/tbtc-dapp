import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { closeModal } from '../actions'
import TBTCLogo from './svgs/TBTCLogo'

class App extends Component {
  render() {
    const { children, renderModal, closeModal } = this.props

    return (
      <div className="main">
        <div className={`modal ${renderModal ? 'open' : 'closed'}`}>
          <div className="modal-body">
            <div className="close">
              <div className="x" onClick={closeModal}>&#9587;</div>
            </div>
            { renderModal && renderModal()}
          </div>
        </div>
        <div className="app">
          <header className="nav">
            <div className="logo">
              <TBTCLogo width="150" />
            </div>
            <div className="hamburger">&#x2e2c;</div>
          </header>
          { children }
        </div>
        <footer>
          <div className="footer-content">
            <div className="white-paper">
              <div className="white-paper-label">
                How does it work?
              </div>
              <hr />
              <div className="white-paper-link">
                <a href="keep.network" target="_blank">
                  Read the White Paper >>>>
                </a>
              </div>
            </div>
            <div className="footer-logo">
              <TBTCLogo width="150" />
            </div>
            <div className="footer-links">
              <a href="keep.network" target="_blank">
                about
              </a>
              <a href="keep.network" target="_blank">
                press
              </a>
              <a href="keep.network" target="_blank">
                related
              </a>
              <a href="keep.network" target="_blank">
                contact
              </a>
            </div>
          </div>
        </footer>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
      renderModal: state.modal.renderModal,
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
)(App)
