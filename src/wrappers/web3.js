import React, { Component } from 'react'
import Web3 from 'web3'
import { setDefaults } from 'tbtc-client'

const Web3Context = React.createContext({})

class Web3Wrapper extends Component {
    state = {
        loading: true,
        account: null,
    }

    componentDidMount() {
        if (window.web3) {
            this.setState({
                web3: new Web3(window.web3.currentProvider)
            }, () => {
                // Initial fetch
                this.getAndSetAccountInfo().then(() => {
                    this.setState({ loading: false })
                })

                // Watch for changes
                const provider = this.state.web3.eth.currentProvider
                provider.on('networkChanged', this.getAndSetAccountInfo)
                provider.on('accountsChanged', this.getAndSetAccountInfo)
            })
        }
    }

    getAndSetAccountInfo = async () => {
        const { account:currentAccount, web3 } = this.state

        if (web3) {
            const accounts = await web3.eth.getAccounts()
            if (accounts.length && accounts[0] !== currentAccount) {
                const balance = await this.getBalanceForAccount(accounts[0])

                await this.initialiseContracts()

                this.setState({
                    balance,
                    account: accounts[0]
                })
            }
        }
    }

    initialiseContracts = async () => {
        const { web3 } = this.state
        // TruffleContract was built to use web3 0.3.0, which uses an API method of `sendAsync`
        // in later versions of web (1.0.0), this method was renamed to `send`
        // This hack makes them work together again.
        // https://github.com/ethereum/web3.js/issues/1119
        web3.providers.HttpProvider.prototype.sendAsync = web3.providers.HttpProvider.prototype.send

        await setDefaults(web3)
    }

    getBalanceForAccount = async (account) => {
        const { web3 } = this.state

        if (web3) {
            return await web3.eth.getBalance(account)
        }
    }

    render() {
        const { account, balance, loading, web3 } = this.state

        const contextValue = { account, balance, web3 }

        if (loading) {
            return <span>Loading...</span> 
        }

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