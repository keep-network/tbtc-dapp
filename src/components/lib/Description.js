import React from "react"

const Description = ({ children, error }) => (
  <div className={error ? "error" : "description"}>
    { error ? error : children }
  </div>
)

export default Description
