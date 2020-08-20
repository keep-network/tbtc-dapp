import React, { Component } from "react"
import PropTypes from "prop-types"

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

ContractWrapper.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
}

function withSomeContract(Child) {
  return function WrappedWithSomeContract(props) {
    return (
      <ContractContext.Consumer>
        {({ someContract }) => <Child {...props} someContract={someContract} />}
      </ContractContext.Consumer>
    )
  }
}

const ContractConsumer = ContractContext.Consumer
export { ContractConsumer, withSomeContract }
export default ContractWrapper
