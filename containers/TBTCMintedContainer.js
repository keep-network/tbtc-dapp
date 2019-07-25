import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { TBTCMinted } from '../components/TBTCMinted';

function mapStateToProps(state, ownProps) {
    return {
        txHash: state.form.tbtcMintedTxId
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(
        {
        },
        dispatch
    )
}

export default connect(mapStateToProps, mapDispatchToProps)(TBTCMinted)