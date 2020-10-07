import React from "react"
import PropTypes from "prop-types"

const TLogoCircle = ({ size = 104, fill = "#080503" }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      fill="none"
      viewBox="0 0 104 104"
    >
      <path
        fill={fill}
        d="M69.765 48.641h-35.53a.64.64 0 00-.648.648v5.989a.64.64 0 00.648.647H47.71v18.25a.64.64 0 00.648.648h7.365a.64.64 0 00.647-.647v-18.25h13.476a.64.64 0 00.647-.648v-5.99c-.08-.364-.364-.647-.728-.647zM52 40.143a5.466 5.466 0 005.463-5.463A5.466 5.466 0 0052 29.217a5.466 5.466 0 00-5.463 5.463A5.44 5.44 0 0052 40.143z"
      ></path>
      <path
        fill={fill}
        d="M52 0C23.268 0 0 23.268 0 52c0 28.731 23.268 52 52 52 28.731 0 52-23.269 52-52 0-28.732-23.269-52-52-52zm31.888 83.888C75.349 92.426 64.018 97.12 52 97.12c-12.019 0-23.39-4.694-31.888-13.233C11.574 75.39 6.88 64.059 6.88 52c0-12.06 4.694-23.39 13.233-31.888C28.61 11.574 39.941 6.88 52 6.88c12.06 0 23.39 4.694 31.888 13.233C92.426 28.651 97.12 39.982 97.12 52c0 12.06-4.694 23.39-13.233 31.888z"
      ></path>
    </svg>
  )
}

TLogoCircle.propTypes = {
  size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  fill: PropTypes.string,
}

export default TLogoCircle
