import React from 'react'
import { withRouter } from 'react-router'

import { Footer, Header } from './lib'

function App(props) {
  const { children, location } = props

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

export default withRouter(App)
