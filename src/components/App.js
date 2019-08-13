import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import TBTCLogo from './svgs/TBTCLogo'
import { Modal } from './lib'
import { openModal } from '../actions'

class App extends Component {
  render() {
    const { children, openModal } = this.props

    return (
      <div className="main" onMouseLeave={openModal}>
        <Modal />
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

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
      {
        openModal
      },
      dispatch
  )
}

export default connect(
  () => ({}),
  mapDispatchToProps
)(App)
