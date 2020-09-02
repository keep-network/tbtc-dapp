import React from "react"
import PropTypes from "prop-types"

const Description = ({ children, error }) => (
  <div className={error ? "error" : "description"}>
    {error ? error : children}
  </div>
)

Description.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  error: PropTypes.string,
}

export default Description
