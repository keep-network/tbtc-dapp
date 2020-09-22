import React from "react"
import PropTypes from "prop-types"
import classNames from "classnames"
import { connect } from "react-redux"

import ProgressPanel, {
  Step,
  StepDetailSuccessOrError,
} from "../lib/ProgressPanel"

const RedemptionPage = ({
  children,
  className,
  completedStepIndex,
  activeStepIndex,
  depositAddress,
  confirmationError,
  proveRedemptionError,
}) => {
  return (
    <div className={classNames("page", "redemption-page", className)}>
      <div className="page-content">{children}</div>
      <ProgressPanel
        className="redemption-progress"
        completedStepIndex={completedStepIndex}
        activeStepIndex={activeStepIndex}
      >
        <Step title="Start" />
        <Step title="Redeem Bond">
          {depositAddress ? (
            <div className="address-label">{depositAddress}</div>
          ) : (
            ""
          )}
        </Step>
        <Step title="Sign Transaction" />
        <Step title="Transaction Confirmation">
          <StepDetailSuccessOrError
            completedStepIndex={completedStepIndex}
            minCompletedStepIndex={3}
            error={confirmationError}
          />
        </Step>
        <Step title="Prove Redemption">
          <StepDetailSuccessOrError
            completedStepIndex={completedStepIndex}
            minCompletedStepIndex={4}
            error={proveRedemptionError}
          />
        </Step>
        <Step title="Complete" />
      </ProgressPanel>
    </div>
  )
}

RedemptionPage.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  className: PropTypes.string,
  completedStepIndex: PropTypes.number,
  activeStepIndex: PropTypes.number,
  depositAddress: PropTypes.string,
  confirmationError: PropTypes.string,
  proveRedemptionError: PropTypes.string,
}

const mapStateToProps = (state) => ({
  completedStepIndex: state.progressPanel.redemption.completedStepIndex,
  activeStepIndex: state.progressPanel.redemption.activeStepIndex,
  depositAddress: state.redemption.depositAddress,
  confirmationError: state.redemption.confirmationError,
  proveRedemptionError: state.redemption.proveRedemptionError,
})

export default connect(mapStateToProps, null)(RedemptionPage)
