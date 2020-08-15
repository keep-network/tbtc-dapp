import React, { useEffect } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import history from '../../history'
import { requestPermission } from '../../lib/notifications'
import { selectLotSize, requestAvailableLotSizes } from '../../actions'
import Description from "../lib/Description"
import StatusIndicator from '../svgs/StatusIndicator'
import BTCLogo from '../svgs/btclogo'
import { useWeb3React } from '@web3-react/core'
import LotSizeSelector from './LotSizeSelector'
import { formatSatsToBtc } from '../../utils'

const handleClickPay = (evt) => {
  evt.preventDefault()
  evt.stopPropagation()

  history.push('/deposit/new')
}

const Start = ({
  requestAvailableLotSizes,
  availableLotSizes = [],
  lotSize,
  selectLotSize,
  error
}) => {
  useEffect(() => {
    requestPermission()
  }, [])

  let { account } = useWeb3React()

  useEffect(() => {
    if (account) {
      requestAvailableLotSizes()
    }
  }, [account, requestAvailableLotSizes])

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
        { typeof account === 'undefined'
          ? 'Connect Wallet to Continue'
          : (error
            ? 'Error getting available lot sizes'
            : 'Select Lot Size')
        }
      </div>
      <hr />
      <Description error={error}>
        <LotSizeSelector
          lotSizes={availableLotSizes}
          onSelect={selectLotSize} />
      </Description>
      <div className='cta'>
        <button
          onClick={handleClickPay}
          disabled={typeof account === 'undefined' || !lotSize}
          >
          Create Address
        </button>
      </div>
    </div>
  </div>
}

const mapStateToProps = ({ deposit }) => ({
  lotSize: deposit.lotSize,
  availableLotSizes: deposit.availableLotSizes.map(ls => formatSatsToBtc(ls)),
  error: deposit.lotSizeError,
})

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    { selectLotSize, requestAvailableLotSizes, },
    dispatch
  )
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Start)
