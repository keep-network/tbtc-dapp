import React, { useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import { InjectedConnector } from '@web3-react/injected-connector'
import { LedgerConnector } from '../../connectors/ledger'
import { TrezorConnector } from '../../connectors/trezor'
import { getChainId, getWsUrl } from '../../connectors/utils'

const CHAIN_ID = getChainId()
const ETH_RPC_URL = getWsUrl()

// Connectors.
const injectedConnector = new InjectedConnector({})

const ledgerLiveConnector = new LedgerConnector({
    chainId: CHAIN_ID,
	url: ETH_RPC_URL,
	baseDerivationPath: "44'/60'/0'/0",
})

const ledgerLegacyConnector = new LedgerConnector({
    chainId: CHAIN_ID,
	url: ETH_RPC_URL,
	baseDerivationPath: "44'/60'/0'",
})

const trezorConnector = new TrezorConnector({ 
	chainId: CHAIN_ID,
	pollingInterval: 1000,
	requestTimeoutMs: 1000,
	config: {
		chainId: CHAIN_ID,
	},
	url: ETH_RPC_URL,
	manifestEmail: 'contact@keep.network', 
	manifestAppUrl: 'https://localhost'
})

// Wallets.
const WALLETS = [
	{
		name: "Metamask",
		icon: "/images/metamask-fox.svg",
		connector: injectedConnector
	},
	{
		name: "Ledger Legacy",
		icon: "/images/ledger.svg",
		connector: ledgerLegacyConnector,
		isHardwareWallet: true,
	},
	{
		name: "Ledger Live",
		icon: "/images/ledger.svg",
		connector: ledgerLiveConnector,
		isHardwareWallet: true,
	},
	{
		name: "Trezor",
		icon: "/images/trezor.svg",
		connector: trezorConnector,
		isHardwareWallet: true,
	}
]


export const ConnectWalletDialog = ({ shown, onConnected, onClose }) => {
	const { active, account, activate } = useWeb3React()

	let [chosenWallet, setChosenWallet] = useState({})
	let [error, setError] = useState(null)
	const [availableAccounts, setAvailableAccounts] = useState([])

	async function chooseWallet(wallet) {
		try {
			setChosenWallet(wallet)
			if(wallet.isHardwareWallet) {
				await wallet.connector.activate()
				setAvailableAccounts(await wallet.connector.getAccounts())
			} else {
				await activateProvider(null, wallet)
			}
		} catch(error) {
			setError(error.toString())
		}
	}

	const activateProvider = async (selectedAccount, wallet = chosenWallet) => {
		try {
			if(wallet.isHardwareWallet) {
				wallet.connector.setDefaultAccount(selectedAccount)
			}
			await activate(wallet.connector, undefined, true)
			onConnected()
		} catch(ex) {
			setError(ex.toString())
		}
	}

	const reconnectWallet = async () => {
		setError(null)
		await chooseWallet(chosenWallet)
	}

	return <div className={`modal connect-wallet ${shown ? 'open' : 'closed'}`}>
		<div className="modal-body">
			<div className="close">
				<div className="x" onClick={onClose}>&#9587;</div>
			</div>
			{!chosenWallet.name && <ChooseWalletStep onChooseWallet={chooseWallet} />}
			{(chosenWallet.name && !active) &&
				<ConnectToWalletStep
				wallet={chosenWallet}
				error={error}onTryAgainClick={reconnectWallet}
				/>}
			{(chosenWallet.name && active) && <ConnectedView wallet={chosenWallet} account={account} />}
			<ChooseAccount
				wallet={chosenWallet}
				availableAccounts={availableAccounts}
				active={active}
				onAccountSelect={activateProvider}
			/>
		</div>
	</div>
}

const ChooseWalletStep = ({ onChooseWallet }) => {
	return <>
		<div className="title">Connect to a wallet</div>
		<p>This wallet will be used to sign transactions on Ethereum.</p>

		<ul className='wallets'>
			{
				WALLETS.map(wallet => {
					return <li key={wallet.name} className='wallet-option' onClick={() => onChooseWallet(wallet)}>
						<img alt="wallet-icon" src={wallet.icon} />
						{wallet.name}
					</li>
				})
			}
		</ul>
	</>
}

const ConnectToWalletStep = ({ error, wallet, onTryAgainClick }) => {
	if(error) {
		return <ErrorConnecting error={error} wallet={wallet} onTryAgainClick={onTryAgainClick} />
	}

	if(wallet.name.includes('Ledger')) {
		return <>
			<div className="title">Plug In Ledger & Enter Pin</div>
			<p>Open Ethereum application and make sure Contract Data and Browser Support are enabled.</p>
			<p>Connecting...</p>
		</>
	}

	return <>
		<div className="title">Connect to a wallet</div>
		<p>Connecting to {wallet.name} wallet...</p>
	</>
}

const ChooseAccount = ({ wallet, availableAccounts, active, onAccountSelect }) => {
	if(wallet.isHardwareWallet && availableAccounts.length !== 0 && !active) {
		return (
			<>
				<div className="title mb-2">Select account</div>
				{availableAccounts.map(account => (
					<div key={account} className="cursor-pointer mb-1" onClick={() => onAccountSelect(account)}>
						{account}
					</div>
				))}
			</>
		)
	} 

	return null
}

const ConnectedView = ({ wallet, account }) => {
	return <div className='connected-view'>
		<div className="title">Wallet connected</div>
		<div className='details'>
			<p>{wallet.name}</p>
			<p>Account: {account}</p>
		</div>
	</div>
}

const ErrorConnecting = ({ wallet, error, onTryAgainClick }) => {
	return <>
		<div className="title">Connect to a wallet</div>
		<p>Error connecting to {wallet.name} wallet...</p>
		<span onClick={onTryAgainClick}>
			Try Again
		</span>
		{ error && <p>{error}</p> }
	</>
}