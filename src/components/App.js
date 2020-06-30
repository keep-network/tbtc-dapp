import React from 'react'
import { withRouter } from 'react-router'

import { Footer, Header } from './lib'

function App(props) {
  const { children, location } = props

  return (
    <div className="main">
      <div className="app">
        <Header />

        <p className="warning">
          The tBTC dApp is in ALPHA. Improper use can lead to LOSS OF FUNDS. If
          you're uncomfortable with these risks, consider using another method
          to mint TBTC. Visit <a href="https://discord.gg/Bpzfsgx">our
          Discord</a> for options.
        </p>

        { children }
      </div>
      <Footer includeSubscription={
        location.pathname === '/' ||
        location.pathname.startsWith('/news') // TODO: remove when proper CMS is selected
      } />
    </div>
  )
}

export default withRouter(App)
