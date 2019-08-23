import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'

import { Footer, Header, Modal } from './lib'
import { openModal } from '../actions'

class App extends Component {
  componentDidMount() {
    this.props.openModal()
  }
  render() {
    const { children, openModal, location } = this.props

    return (
      <div className="main" onMouseLeave={() => {}}>
        <Modal />
        <div className="app">
          <Header />
          { children }
        </div>
        <Footer includeSubscription={location.pathname === '/'} />
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
)(withRouter(App))
