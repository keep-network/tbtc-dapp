import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { AwaitDepositConfirmation } from '../components/AwaitDepositConfirmation'
import { waitConfirmation } from '../actions'

class AwaitDepositConfirmationContainer extends React.Component {
    componentDidMount() {
        this.props.waitConfirmation()
    }

    render() {
        return <AwaitDepositConfirmation {...this.props}/>
    }
}

function mapStateToProps(state, ownProps) {
    return {
        address: state.form.btcAddress
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(
        {
            waitConfirmation
        },
        dispatch
    )
}

export default connect(mapStateToProps, mapDispatchToProps)(AwaitDepositConfirmationContainer)