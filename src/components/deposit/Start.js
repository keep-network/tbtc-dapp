import React, { useEffect, useState } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { BitcoinHelpers } from '@keep-network/tbtc.js'

import history from '../../history'
import { requestPermission } from '../../lib/notifications'
import { selectLotSize, requestAvailableLotSizes } from '../../actions'
import StatusIndicator from '../svgs/StatusIndicator'
import BTCLogo from '../svgs/btclogo'
import { useWeb3React } from '@web3-react/core'
import LotSizeSelector from './LotSizeSelector'

import BigNumber from "bignumber.js"
BigNumber.set({ DECIMAL_PLACES: 8 })

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

  const [lotSizesInBtc, setLotSizesInBtc] = useState([])
  useEffect(() => {
    setLotSizesInBtc(
      availableLotSizes
        .map(lotSize => (new BigNumber(lotSize.toString()))
          .div(BitcoinHelpers.satoshisPerBtc.toString()).toString()
        )
    )
  }, [availableLotSizes])

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
        { error ? 'Error getting available lot sizes' : 'Select Lot Size' }
      </div>
      <hr />
      <div className={error ? "error" : "description"}>
        { error ? error : (
          <LotSizeSelector
            lotSizes={lotSizesInBtc}
            onSelect={selectLotSize} />
        )}
      </div>
      <div className='cta'>
        <button
          onClick={handleClickPay}
          disabled={typeof account === 'undefined' || !lotSize}
          className="black"
          >
          Create Address
        </button>
      </div>
    </div>
  </div>
}

const mapStateToProps = (state) => ({
  lotSize: state.deposit.lotSize,
  availableLotSizes: state.deposit.availableLotSizes,
  error: state.deposit.lotSizeError,
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
