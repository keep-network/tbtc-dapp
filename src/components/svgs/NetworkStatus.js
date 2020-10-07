import React from "react"
import PropTypes from "prop-types"

const NetworkStatus = ({ size = 12, fill = "#080503" }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      fill="none"
      viewBox="0 0 12 12"
    >
      <path
        fill={fill}
        d="M6 12a6 6 0 10-6-6 6.006 6.006 0 006 6zm-.75-8.5a.75.75 0 011.5 0v4.75a.75.75 0 01-1.5 0V3.5z"
      ></path>
    </svg>
  )
}

NetworkStatus.propTypes = {
  size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  fill: PropTypes.string,
}

export default NetworkStatus
