import React from 'react'
import classnames from 'classnames'

import Wavy from './Wavy'
import WavyDonut from './WavyDonut'

const StatusIndicator = ({ pulse = false, fadeIn = false, donut = false, children }) => {
  return (
    <div className={classnames('status-indicator', { pulse, 'rotate': pulse, 'fade-in': fadeIn })}>
      { children }
      { donut ? <WavyDonut /> : <Wavy /> }
    </div>
  )
}

export default StatusIndicator