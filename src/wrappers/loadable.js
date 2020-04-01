import React, { useEffect } from 'react'
import { Router, Route, useParams } from 'react-router-dom'
import { bindActionCreators } from 'redux'
import { connect, useSelector } from 'react-redux'
import { restoreDepositState, restoreRedemptionState } from '../actions';
import { useWeb3React } from '@web3-react/core'

export const RESTORER = {
  DEPOSIT: 'deposit',
  REDEMPTION: 'redemption'
}

function LoadableBase({ children, account, restoreDepositState, restoreRedemptionState, restorer }) {
    // Wait for web3 connected
    const { active: web3Active } = useWeb3React()
    const { address } = useParams()
    const depositStateRestored = useSelector((state) => state[restorer].stateRestored)
    
    useEffect(() => {
        if(web3Active) {
            if (address && ! depositStateRestored) {
                if (restorer == RESTORER.DEPOSIT) {
                    restoreDepositState(address)
                } else if (restorer == RESTORER.REDEMPTION) {
                    restoreRedemptionState(address)
                } else {
                    throw "Unknown restorer."
                }
                // return <div>Loading...</div>
            } else {
                // FIXME How do we not render these if we're getting ready to transition to
                // FIXME a new page?
                // return children
            }
        }
    }, [web3Active])

    if(!depositStateRestored) {
        return <div className="pay">
            <div className="page-top">
                <p>Loading...</p>
            </div>
            <div className="page-body">
            </div>
        </div>
    }
    
    return children
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators(
        {
            restoreDepositState,
            restoreRedemptionState
        },
        dispatch
    );
}

const Loadable = connect(null, mapDispatchToProps)(LoadableBase)

export default Loadable