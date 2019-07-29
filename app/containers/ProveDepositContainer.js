import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { ProveDeposit } from '../components/ProveDeposit'
import { submitProof } from '../actions'

function mapStateToProps(state, ownProps) {
    return {
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(
        {
            submitProof
        },
        dispatch
    )
}

export default connect(mapStateToProps, mapDispatchToProps)(ProveDeposit)