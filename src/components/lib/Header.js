import React from "react"
import { NavLink } from "react-router-dom"

import TBTCLogo from "../svgs/TBTCLogo"
import Web3Status from "./Web3Status"

const Header = (props) => (
  <header className="header">
    <div className="logo">
      <TBTCLogo width="132" />
    </div>
    <Web3Status />
    <nav className="side-nav">
      <ul>
        <li>
          <NavLink to="/" exact>
            Overview
          </NavLink>
        </li>
        <li>
          <NavLink to="deposit">Mint</NavLink>
        </li>
        <li>
          <NavLink to="/redeem">Redeem</NavLink>
        </li>
      </ul>
    </nav>
  </header>
)

export default Header
