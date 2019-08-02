import React, { Component } from 'react'
import Web3 from 'web3'

const Web3Context = React.createContext({})

class Web3Wrapper extends Component {
    state = {}

    componentDidMount() {
        if (window.web3) {
            this.setState({
                web3: new Web3(window.web3.currentProvider)
            }, () => {
                this.getAccountInfo()
            })
        }

        if (window.ethereum) {
            window.ethereum.on('accountChange', this.getAccountInfo)
            window.ethereum.on('networkChange', this.getAccountInfo)
        }
    }

    getAccountInfo = async () => {
        console.log("CHANGE!")
        const { web3 } = this.state

        if (web3) {
            const accounts = await web3.eth.getAccounts()
            if (accounts.length) {
                web3.eth.getBalance(accounts[0]).then(res => {
                    this.setState({ balance: res, account: accounts[0] })
                })
            }
        }
    }

    render() {
        const { account, balance, web3 } = this.state

        const contextValue = { account, balance, web3 }

        if (!web3) {
            return <span>Please Install MetaMask and refresh the page</span>
        }

        if (!account) {
            return <span>Please Log Into MetaMask</span>
        }

        return (
            <Web3Context.Provider value={contextValue}>
                {this.props.children}
            </Web3Context.Provider>
        )
    }
}

function withWeb3(Child) {
    return (props) => (
        <Web3Context.Consumer>
            {({ web3 }) => <Child {...props} web3={web3} />}
        </Web3Context.Consumer>
    )
}

function withAccount(Child) {
    return (props) => (
        <Web3Context.Consumer>
            {({ account }) => <Child {...props} account={account} />}
        </Web3Context.Consumer>
    )
}

function withBalance(Child) {
    return (props) => (
        <Web3Context.Consumer>
            {({ balance }) => <Child {...props} balance={balance} />}
        </Web3Context.Consumer>
    )
}

const Web3Consumer = Web3Context.Consumer
export { Web3Consumer, withWeb3, withAccount, withBalance }
export default Web3Wrapper