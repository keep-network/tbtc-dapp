import React, { Component } from 'react'
import { useParams } from "react-router-dom"
import { useSelector, connect } from "react-redux"
import { bindActionCreators } from "redux"
import { withAccount } from '../wrappers/web3'
import { setEthereumAccount, restoreDepositState, restoreRedemptionState } from '../actions'

export const RESTORER = {
    DEPOSIT: 'deposit',
    REDEMPTION: 'redemption'
}

function LoadableBase({ children, account, setEthereumAccount, restoreDepositState, restoreRedemptionState, restorer }) {
    const { address } = useParams()
    const depositStateRestored = useSelector((state) => state[restorer].stateRestored)
    const stateAccount = useSelector((state) => state.account)

    if (account && account != stateAccount) {
        setEthereumAccount(account)
    }

    if (address && !depositStateRestored) {
        if (stateAccount) {
            if (restorer == RESTORER.DEPOSIT) {
                restoreDepositState(address)
            } else if (restorer == RESTORER.REDEMPTION) {
                restoreRedemptionState(address)
            } else {
                throw "Unknown restorer."
            }
        }

        return <div>Loading...</div>
    } else {
        // FIXME How do we not render these if we're getting ready to transition to
        // FIXME a new page?
        return children
    }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators(
        {
            setEthereumAccount,
            restoreDepositState,
            restoreRedemptionState
        },
        dispatch
    );
}

export default connect(null, mapDispatchToProps)(withAccount(LoadableBase))