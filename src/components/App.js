import React, { Component } from 'react'
import { withRouter } from 'react-router'

import { Footer, Header } from './lib'

class App extends Component {
  render() {
    const { children, location } = this.props

    return (
      <div className="main">
        <div className="app">
          <Header />
          { children }
        </div>
        <Footer includeSubscription={location.pathname === '/'} />
      </div>
    )
  }
}

export default withRouter(App)
