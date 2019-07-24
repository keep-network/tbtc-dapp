import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { AwaitDepositConfirmation } from '../components/AwaitDepositConfirmation'


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

export default connect(mapStateToProps, mapDispatchToProps)(AwaitDepositConfirmation)