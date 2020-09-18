import React from "react"
import PropTypes from "prop-types"
import classNames from "classnames"

import ProgressPanel, { Step } from "../lib/ProgressPanel"

const DepositPage = ({ children, className }) => {
  return (
    <div className={classNames("page", "deposit-page", className)}>
      <div className="page-content">{children}</div>
      <ProgressPanel className="deposit-progress">
        <Step title="Start" />
        <Step title="Deposit Size" />
        <Step title="Send BTC" />
        <Step title="BTC Block Confirmation" />
        <Step title="Prove Complete" />
        <Step title="Complete" />
      </ProgressPanel>
    </div>
  )
}

DepositPage.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  className: PropTypes.string,
}

export default DepositPage
