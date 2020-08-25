import React from "react"
import classnames from "classnames"
import PropTypes from "prop-types"

import Wavy from "./Wavy"
import WavyDonut from "./WavyDonut"

const StatusIndicator = ({
  pulse = false,
  fadeIn = false,
  donut = false,
  children,
}) => {
  return (
    <div
      className={classnames("status-indicator", {
        pulse,
        rotate: pulse,
        "fade-in": fadeIn,
      })}
    >
      {children}
      {donut ? <WavyDonut /> : <Wavy />}
    </div>
  )
}

StatusIndicator.propTypes = {
  pulse: PropTypes.bool,
  fadeIn: PropTypes.bool,
  donut: PropTypes.bool,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
}

export default StatusIndicator
