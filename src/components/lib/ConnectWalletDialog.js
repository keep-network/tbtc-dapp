import React, { useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import { InjectedConnector } from '@web3-react/injected-connector'

const SUPPORTED_CHAIN_IDS = [
	// Mainnet
	1,
	// Ropsten
	3,
	// Rinkeby
	4,
	// Dev chains (Ganache, Geth)
	123, // Low chainId to workaround ledgerjs signing issues.
	1337,
	// Keep testnet
	1101
]

// Connectors.
const injectedConnector = new InjectedConnector({
	supportedChainIds: SUPPORTED_CHAIN_IDS
})

// Wallets.
const WALLETS = [
	{
		name: "Metamask",
		icon: "/images/metamask-fox.svg",
		showName: true
	}
]

export const ConnectWalletDialog = ({ shown, onConnected }) => {
	const { active, account, activate } = useWeb3React()

	let [chosenWallet, setChosenWallet] = useState(null)
	let [error, setError] = useState(null)

	async function chooseWallet(wallet) {
		setChosenWallet(wallet)

		try {
			await activate(injectedConnector, undefined, true)
			onConnected()
		} catch(ex) {
			setError(ex.toString())
			throw ex
		}
	}

	const ChooseWalletStep = () => {
		return <>
			<header>
				<div className="title">Connect To A Wallet</div>
			</header>
			<p>This wallet will be used to sign transactions on Ethereum.</p>

			<ul className='wallets'>
				{
					WALLETS.map(({ name, icon, showName }) => {
						return <li key={name} className='wallet-option' onClick={() => chooseWallet(name)}>
							<img src={icon} alt={`${name} icon`} />
							{showName && name}
						</li>
					})
				}
			</ul>
		</>
	}

	const ConnectToWalletStep = () => {
		return <>
			<header>
				<div className="title">Connect To A Wallet</div>
			</header>
			<p>Connecting to {chosenWallet} wallet...</p>
			{ error && <p>{error}</p> }
		</>
	}

	const ConnectedView = () => {
		return <div className='connected-view'>
			<header>
				<div className="title">Connect To A Wallet</div>
			</header>

			<div className='details'>
				<p>{chosenWallet}</p>
				<p>
					{account}
				</p>
			</div>
		</div>
	}

	return <div>
		<div className={`modal connect-wallet ${shown ? 'open' : 'closed'}`}>
			<div className="modal-body">
				{!chosenWallet && <ChooseWalletStep />}
				{(chosenWallet && !active) && <ConnectToWalletStep />}
				{(chosenWallet && active) && <ConnectedView />}
			</div>
		</div>
	</div>
}