import React, { Component } from 'react'
import contract from 'truffle-contract'

const ContractContext = React.createContext({})

class ContractWrapper extends Component {
    state = {}

    componentDidMount() {
        // Here, build contracts and save to state
        const someContract = "TODO"

        this.setState({ someContract })
    }

    render() {
        const { someContract } = this.state

        const contextValue = { someContract }

        return (
            <ContractContext.Provider value={contextValue}>
                {this.props.children}
            </ContractContext.Provider>
        )
    }
}

function withSomeContract(Child) {
    return (props) => (
        <ContractContext.Consumer>
            {({ someContract }) => <Child {...props} someContract={someContract} />}
        </ContractContext.Consumer>
    )
}

const ContractConsumer = ContractContext.Consumer
export { ContractConsumer, withSomeContract }
export default ContractWrapper