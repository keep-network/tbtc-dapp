import React from "react"
import classNames from "classnames"
import PropTypes from "prop-types"

export const Step = ({ title, children, active, completed }) => (
  <li className={classNames("step", { active, completed })}>
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
  active: PropTypes.bool,
  completed: PropTypes.bool,
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
