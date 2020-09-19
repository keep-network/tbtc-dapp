import React from "react"
import PropTypes from "prop-types"
import classNames from "classnames"
import { connect } from "react-redux"

import ProgressPanel, { Step } from "../lib/ProgressPanel"

const DepositPage = ({
  children,
  className,
  completedStepIndex,
  activeStepIndex,
}) => {
  return (
    <div className={classNames("page", "deposit-page", className)}>
      <div className="page-content">{children}</div>
      <ProgressPanel
        className="deposit-progress"
        completedStepIndex={completedStepIndex}
        activeStepIndex={activeStepIndex}
      >
        <Step title="Start" />
        <Step title="Deposit Size" />
        <Step title="Send BTC" />
        <Step title="BTC Block Confirmation" />
        <Step title="Prove Deposit" />
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
  completedStepIndex: PropTypes.number,
  activeStepIndex: PropTypes.number,
}

const mapStateToProps = ({ progressPanel }) => ({
  completedStepIndex: progressPanel.deposit.completedStepIndex,
  activeStepIndex: progressPanel.deposit.activeStepIndex,
})

export default connect(mapStateToProps, null)(DepositPage)
