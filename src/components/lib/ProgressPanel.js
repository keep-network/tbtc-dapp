import React from "react"
import classNames from "classnames"
import PropTypes from "prop-types"

export const Step = ({ title, children, isActive, isCompleted }) => (
  <li
    className={classNames("step", { active: isActive, completed: isCompleted })}
  >
    <div className="step-title">{title}</div>
    <div className="step-details">{children}</div>
  </li>
)

Step.propTypes = {
  title: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  isActive: PropTypes.bool,
  isCompleted: PropTypes.bool,
}

const ProgressPanel = ({ className, children }) => (
  <ul className={classNames("progress-panel", className)}>{children}</ul>
)

ProgressPanel.propTypes = {
  className: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
}

export default ProgressPanel
