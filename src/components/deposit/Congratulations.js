import React from 'react'

import Wavy from '../svgs/Wavy'

const Congratulations = () => (
  <div className="congratulations">
    <div className="page-top">
      <Wavy loading />
    </div>
    <div className="page-body">
      <div className="step">
        Step 5/5
      </div>
      <div className="title">
        Complete
      </div>
      <hr />
      <div className="description">
        <div className="description-content">
          You are now the proud beneficiary of 1 TBTC
        </div>
        <div className="bond-duration">
          Bond duration: 6 months
        </div>
      </div>
    </div>
  </div>
)

export default Congratulations
