import React from "react"
import PropTypes from "prop-types"

import Description from "./Description"
import StatusIndicator from "../svgs/StatusIndicator"

const Confirming = ({
  className,
  stepStatus,
  error,
  requiredConfirmations,
  confirmations,
  children,
}) => {
  return (
    <div className={className}>
      <div className="page-top">
        <StatusIndicator pulse />
      </div>
      <div className="page-body">
        <div className="step">Step {stepStatus}</div>
        <div className="title">
          {error ? "Error confirming transaction" : "Confirming..."}
        </div>
        <hr />
        <Description error={error}>
          <div>
            Waiting for {requiredConfirmations} transaction{" "}
            {`confirmation${requiredConfirmations > 1 ? "s" : ""}`}.
            <p>
              {confirmations} / {requiredConfirmations} blocks confirmed
            </p>
          </div>
          {children}
        </Description>
      </div>
    </div>
  )
}

Confirming.propTypes = {
  className: PropTypes.string,
  stepStatus: PropTypes.string,
  error: PropTypes.string,
  requiredConfirmations: PropTypes.number,
  confirmations: PropTypes.number,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
}

export default Confirming
