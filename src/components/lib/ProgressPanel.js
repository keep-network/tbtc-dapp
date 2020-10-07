import React from "react"
import classNames from "classnames"
import PropTypes from "prop-types"

export const Step = ({ title, children, active, completed }) => (
  <li className={classNames("step", { active, completed })}>
    <div className="step-title">{title}</div>
    {children ? <div className="step-details">{children}</div> : ""}
  </li>
)

Step.propTypes = {
  title: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  active: PropTypes.bool,
  completed: PropTypes.bool,
}

export const StepDetailSuccessOrError = ({
  completedStepIndex,
  minCompletedStepIndex,
  error,
}) => {
  if (error) {
    return <div className="error">Failed</div>
  } else if (completedStepIndex >= minCompletedStepIndex) {
    return <div>Success</div>
  }
  return null
}

StepDetailSuccessOrError.propTypes = {
  completedStepIndex: PropTypes.number,
  minCompletedStepIndex: PropTypes.number,
  error: PropTypes.string,
}

const ProgressPanel = ({
  className,
  children,
  completedStepIndex,
  activeStepIndex,
}) => (
  <ul className={classNames("progress-panel", className)}>
    {React.Children.map(children, (child, index) => {
      const props = {
        active: index === activeStepIndex,
        completed: completedStepIndex !== null && index <= completedStepIndex,
      }
      return React.cloneElement(child, props)
    })}
  </ul>
)

ProgressPanel.propTypes = {
  className: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  completedStepIndex: PropTypes.number,
  activeStepIndex: PropTypes.number,
}

export default ProgressPanel
