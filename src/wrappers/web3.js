import React, { Component } from 'react'
import Web3 from 'web3'
import TBTC from '@keep-network/tbtc.js'

const Web3Context = React.createContext({})

let loadedWeb3 = null
export let Web3Loaded = new Promise((resolve, _) => {
    function checkAndResolve() {
        if (loadedWeb3) {
            resolve(loadedWeb3)
        } else {
            setTimeout(checkAndResolve, 100)
        }
    }

    checkAndResolve()
})

export let TBTCLoaded = Web3Loaded.then((web3) => {
    web3.eth.defaultAccount = global.ethereum.selectedAddress
    return TBTC.withConfig({
        web3: web3,
        bitcoinNetwork: "testnet",
        electrum: {
            "testnet": {
                "server": "electrumx-server.test.tbtc.network",
                "port": 50002,
                "protocol": "ssl"
            },
            "testnetPublic": {
                "server": "testnet1.bauerj.eu",
                "port": 50002,
                "protocol": "ssl"
            },
            "testnetWS": {
                "server": "electrumx-server.test.tbtc.network",
                "port": 50003,
                "protocol": "ws"
            }
        },
    })
})

class Web3Wrapper extends Component {
    state = {
        account: null,
    }

    connectDapp = () => {
        let provider
        if (typeof window.ethereum !== 'undefined'
        || (typeof window.web3 !== 'undefined')) {
            provider = window.ethereum || window.web3.currentProvider

            this.setState({
                loading: true,
                web3: new Web3(provider)
            }, async () => {
                // Connect to web3 if not done yet
                await this.state.web3.currentProvider.enable()

                // Initial fetch
                await this.getAndSetAccountInfo()

                this.setState({ loading: false })
                loadedWeb3 = this.state.web3

                // Watch for changes
                provider = this.state.web3.eth.currentProvider
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

                this.setState({
                    balance,
                    account: accounts[0]
                })
            }
        }
    }

    getBalanceForAccount = async (account) => {
        const { web3 } = this.state

        if (web3) {
            return await web3.eth.getBalance(account)
        }
    }

    render() {
        const { account, balance, loading, web3 } = this.state

        const contextValue = {
            account,
            balance,
            loading,
            web3,
            connectDapp: this.connectDapp
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

function withConnectDapp(Child) {
    return (props) => (
        <Web3Context.Consumer>
            {({ connectDapp, loading }) => <Child {...props} connectDapp={connectDapp} loading={loading} />}
        </Web3Context.Consumer>
    )
}

const Web3Consumer = Web3Context.Consumer
export { Web3Consumer, withWeb3, withAccount, withBalance, withConnectDapp }
export default Web3Wrapper
