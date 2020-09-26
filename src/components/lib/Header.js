import React from "react"

import { Link } from "react-router-dom"

import TBTCLogo from "../svgs/TBTCLogo"
import Web3Status from "./Web3Status"

const Header = (props) => (
  <header className="nav">
    <Link className="logo" to="/">
      <TBTCLogo width="150" />
    </Link>
    {
      // TODO: remove when proper CMS is selected
      window.location.pathname === "/" ||
      window.location.pathname.startsWith("/news") ? null : (
        <Web3Status />
      )
    }
  </header>
)

export default Header
