import React, { useEffect } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import history from '../../history'
import { requestPermission } from '../../lib/notifications'
import { selectLotSize } from '../../actions'
import StatusIndicator from '../svgs/StatusIndicator'
import BTCLogo from '../svgs/btclogo'
import { useWeb3React } from '@web3-react/core'
import LotSizeSelector from './LotSizeSelector'

const handleClickPay = (evt) => {
  evt.preventDefault()
  evt.stopPropagation()

  history.push('/deposit/new')
}

const Start = ({ lotSize, selectLotSize }) => {
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
        <LotSizeSelector onSelect={selectLotSize} />
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
})

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ selectLotSize }, dispatch)
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Start)
