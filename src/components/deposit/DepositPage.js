import React from "react"
import PropTypes from "prop-types"
import classNames from "classnames"
import { connect } from "react-redux"

import ProgressPanel, { Step } from "../lib/ProgressPanel"
import { formatSatsToBtc, getLotInTbtc } from "../../utils"

const DepositPage = ({
  children,
  className,
  completedStepIndex,
  activeStepIndex,
  btcAmount,
  tbtcAmount,
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
        <Step title="Deposit Size">
          {btcAmount && tbtcAmount ? (
            <div>{`${btcAmount} BTC > ${tbtcAmount} TBTC`}</div>
          ) : (
            ""
          )}
        </Step>
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
  btcAmount: PropTypes.string,
  tbtcAmount: PropTypes.string,
}

const mapStateToProps = (state) => ({
  completedStepIndex: state.progressPanel.deposit.completedStepIndex,
  activeStepIndex: state.progressPanel.deposit.activeStepIndex,
  btcAmount: formatSatsToBtc(state.deposit.lotInSatoshis),
  tbtcAmount: getLotInTbtc(state),
})

export default connect(mapStateToProps, null)(DepositPage)
