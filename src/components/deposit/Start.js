import React, { useEffect } from 'react'

import history from '../../history'
import { requestPermission } from '../../lib/notifications'
import StatusIndicator from '../svgs/StatusIndicator'
import BTCLogo from '../svgs/btclogo'
import { useWeb3React } from '@web3-react/core'
import LotSizeSelector from './LotSizeSelector'

const handleClickPay = (evt) => {
  evt.preventDefault()
  evt.stopPropagation()

  history.push('/deposit/new')
}

const Start = () => {
  useEffect(() => {
    requestPermission()
  }, [])

  let { account } = useWeb3React()

  return <div className="deposit-start">
    <div className="page-top">
      <StatusIndicator>
        <BTCLogo height={100} width={100} />
      </StatusIndicator>
    </div>
    <div className="page-body">
      <div className="step">
        Step 1/5
      </div>
      <div className="title">
        Select Lot Size
      </div>
      <hr />
      <div className="description">
        <LotSizeSelector />
      </div>
      <div className='cta'>
        <button
          onClick={handleClickPay}
          disabled={typeof account === 'undefined'}
          className="black"
          >
          Create Address
        </button>
      </div>
    </div>
  </div>
}

export default Start
