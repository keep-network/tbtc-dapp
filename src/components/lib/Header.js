import React from "react"
import { NavLink } from "react-router-dom"
import classNames from "classnames"
import PropTypes from "prop-types"

import TBTCLogo from "../svgs/TBTCLogo"
import Web3Status from "./Web3Status"

const Header = ({ showNav = false, onToggleBtnClick = () => {} }) => (
  <header className="header">
    <div className="logo">
      <TBTCLogo width="132" />
    </div>
    <Web3Status />
    <button
      className={classNames("side-nav-toggle-btn", { open: showNav })}
      onClick={onToggleBtnClick}
    >
      Navigation
    </button>
    <nav className={classNames("side-nav", { open: showNav })}>
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

Header.propTypes = {
  showNav: PropTypes.bool,
  onToggleBtnClick: PropTypes.func,
}

export default Header
