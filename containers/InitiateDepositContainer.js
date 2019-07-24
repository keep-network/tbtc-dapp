


import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { InitiateDeposit } from '../components/InitiateDeposit'
import { requestADeposit } from "../actions"

function mapStateToProps(state, ownProps) {
    return {
        address: state.form.btcAddress
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(
        {
        },
        dispatch
    )
}

export default connect(mapStateToProps, mapDispatchToProps)(InitiateDeposit)