import React, { useEffect, useRef, useState } from "react"
import classNames from "classnames"
import PropTypes from "prop-types"

const Tooltip = ({
  triggerElement = <button>Help</button>,
  children,
  revealOnHover = true,
  className,
}) => {
  const [showContent, setShowContent] = useState(false)
  const toggleContent = () => {
    setShowContent(!showContent)
  }

  const tooltipRef = useRef(null)
  useEffect(() => {
    const clickOutside = (e) => {
      if (tooltipRef.current && !tooltipRef.current.contains(e.target)) {
        setShowContent(false)
        document.removeEventListener("click", clickOutside)
      }
    }

    // Only add the listener if the dropdown is open
    if (showContent) {
      document.addEventListener("click", clickOutside)
    }
  }, [tooltipRef, showContent])

  return (
    <div
      ref={tooltipRef}
      className={classNames("tooltip", className, { hoverable: revealOnHover })}
    >
      {React.cloneElement(triggerElement, {
        className: "tooltip-trigger",
        onClick: toggleContent,
      })}
      <div className={classNames("tooltip-content", { visible: showContent })}>
        {children}
      </div>
    </div>
  )
}

Tooltip.propTypes = {
  triggerElement: PropTypes.node,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  revealOnHover: PropTypes.bool,
  className: PropTypes.string,
}

export default Tooltip
