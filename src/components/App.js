import React, { useState } from "react"
import { withRouter, useLocation } from "react-router"
import PropTypes from "prop-types"
import classNames from "classnames"

import { Footer, Header } from "./lib"

const App = ({ children }) => {
  const [showNav, setShowNav] = useState(false)
  const toggleNav = () => {
    setShowNav(!showNav)
  }

  const { pathname } = useLocation()

  return (
    <div className="app">
      <Header showNav={showNav} onToggleBtnClick={toggleNav} />
      <div
        className={classNames("content", {
          "side-nav-open": showNav,
          "content-home": pathname === "/",
        })}
      >
        <div className="warning">
          <p>The safety of your funds is important to us.</p>
          <p>
            This dApp is in ALPHA and improper use may lead to LOSS OF FUNDS.
          </p>
          <p>
            For more information and options please{" "}
            <a href="https://discord.gg/Bpzfsgx">visit our Discord community</a>
            .
          </p>
        </div>

        {children}
      </div>
      <Footer />
    </div>
  )
}

App.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
}

export default withRouter(App)
