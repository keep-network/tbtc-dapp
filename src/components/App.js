import React, { Component } from 'react'
import { withRouter, useParams } from 'react-router'

import { Footer, Header } from './lib'

function restoreStateFromAddress(address, location) {
  // Yield async saga situation, then render page.
  // A -- 1 TBTC --> A
  // A --> 0.005 TBTC --> S (A now has a balance of -0.005 TBTC)
  //
  // A -- 1 TBTC - 0.005 TBTC --> A (A now has a balance of -0.005 TBTC)
  //             |-0.005 TBTC --> S
}

function App(props) {
  const { address } = useParams()
  const { children, location } = props

  let currentChildren = address ? <Loading /> : children
  if (address) {
    restoreStateFromAddress(address)
  }
  console.log(address, currentChildren)

  return (
    <div className="main">
      <div className="app">
        <Header />
        { currentChildren }
      </div>
      <Footer includeSubscription={location.pathname === '/'} />
    </div>
  )
}

function Loading(props) {
  return (
    <div>Loading...</div>
  )
}

export default withRouter(App)
