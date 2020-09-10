import React from "react"

import TBTCLogo from "../svgs/TBTCLogo"
import Web3Status from "./Web3Status"

const Header = (props) => (
  <header className="header">
    <div className="logo">
      <TBTCLogo width="150" />
    </div>
    <Web3Status />
  </header>
)

export default Header
