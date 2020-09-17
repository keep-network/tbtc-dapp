import React from "react"

import Tooltip from "./Tooltip"
import { version } from "../../../package.json"

const Footer = () => {
  return (
    <footer>
      <div className="version-info">{`v${version}`}</div>
      <Tooltip
        className="help-menu"
        triggerElement={<button>Help Menu Toggle</button>}
      >
        <ul className="help-menu-links">
          <li>
            <a
              href="https://chat.keep.network/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Join Our Discord
            </a>
          </li>
          <li>
            <a
              href="https://tbtc.network/developers"
              target="_blank"
              rel="noopener noreferrer"
            >
              Build with tBTC
            </a>
          </li>
          <li>
            <a
              href="https://tbtc.network/developers/how-to-use-the-tbtc-dapp/"
              target="_blank"
              rel="noopener noreferrer"
            >
              User Guide
            </a>
          </li>
          <li>
            <a
              href="http://docs.keep.network/tbtc/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Read Spec
            </a>
          </li>
          <li>
            <a
              href="https://tbtc.network/about"
              target="_blank"
              rel="noopener noreferrer"
            >
              About tBTC
            </a>
          </li>
        </ul>
      </Tooltip>
    </footer>
  )
}

export default Footer
