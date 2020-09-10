import React from "react"
import { withRouter } from "react-router"
import PropTypes from "prop-types"

import { Footer, Header } from "./lib"

function App(props) {
  const { children, location } = props

  return (
    <div className="main">
      <div className="app">
        <Header />
        <div className="content">
          <div className="warning">
            <p>The safety of your funds is important to us.</p>
            <p>
              This dApp is in ALPHA and improper use may lead to LOSS OF FUNDS.
            </p>
            <p>
              For more information and options please{" "}
              <a href="https://discord.gg/Bpzfsgx">
                visit our Discord community
              </a>
              .
            </p>
          </div>

          {children}
        </div>
        <Footer includeSubscription={location.pathname === "/"} />
      </div>
    </div>
  )
}

App.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }),
}

export default withRouter(App)
