import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { RequestDeposit } from '../components/RequestDeposit'
import { requestADeposit } from "../actions"

function mapStateToProps(state, ownProps) {
    return {}
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(
        {
            requestADeposit
        },
        dispatch
    )
}

export default connect(mapStateToProps, mapDispatchToProps)(RequestDeposit)