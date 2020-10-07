import React from "react"
import PropTypes from "prop-types"
import classNames from "classnames"
import { connect } from "react-redux"

import ProgressPanel, {
  Step,
  StepDetailSuccessOrError,
} from "../lib/ProgressPanel"
import { useClickToCopy } from "../hooks"
import { formatSatsToBtc, getLotInTbtc } from "../../utils"

const DepositPage = ({
  children,
  className,
  completedStepIndex,
  activeStepIndex,
  btcAmount,
  tbtcAmount,
  btcAddress,
  btcConfirmingError,
  proveDepositError,
}) => {
  const { isCopied, hiddenCopyFieldRef, handleCopyClick } = useClickToCopy()
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
        <Step title="Send BTC">
          {btcAddress ? (
            <>
              <div className="btc-address-copy-click" onClick={handleCopyClick}>
                <span>{btcAddress}</span>
                <button>{isCopied ? "COPIED" : "COPY"}</button>
              </div>
              <textarea
                className="hidden-copy-field"
                ref={hiddenCopyFieldRef}
                defaultValue={btcAddress || ""}
              />
            </>
          ) : (
            ""
          )}
        </Step>
        <Step title="BTC Block Confirmation">
          <StepDetailSuccessOrError
            completedStepIndex={completedStepIndex}
            minCompletedStepIndex={3}
            error={btcConfirmingError}
          />
        </Step>
        <Step title="Prove Deposit">
          <StepDetailSuccessOrError
            completedStepIndex={completedStepIndex}
            minCompletedStepIndex={4}
            error={proveDepositError}
          />
        </Step>
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
  btcAddress: PropTypes.string,
  btcConfirmingError: PropTypes.string,
  proveDepositError: PropTypes.string,
}

const mapStateToProps = (state) => ({
  completedStepIndex: state.progressPanel.deposit.completedStepIndex,
  activeStepIndex: state.progressPanel.deposit.activeStepIndex,
  btcAmount: formatSatsToBtc(state.deposit.lotInSatoshis),
  tbtcAmount: getLotInTbtc(state),
  btcAddress: state.deposit.btcAddress,
  btcConfirmingError: state.deposit.btcConfirmingError,
  proveDepositError: state.deposit.proveDepositError,
})

export default connect(mapStateToProps, null)(DepositPage)
