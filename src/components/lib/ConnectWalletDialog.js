import React, { useState, useEffect } from "react"
import PropTypes from "prop-types"
import { useWeb3React } from "@web3-react/core"
import { InjectedConnector } from "@web3-react/injected-connector"
import { LedgerConnector } from "../../connectors/ledger"
import { LEDGER_DERIVATION_PATHS } from "../../connectors/ledger_subprovider"
import { TrezorConnector } from "../../connectors/trezor"
import { getChainId, getWsUrl } from "../../connectors/utils"

const CHAIN_ID = getChainId()
const ETH_RPC_URL = getWsUrl()

// Connectors.
const injectedConnector = new InjectedConnector({})

const ledgerLiveConnector = new LedgerConnector({
  chainId: CHAIN_ID,
  url: ETH_RPC_URL,
  baseDerivationPath: LEDGER_DERIVATION_PATHS.LEDGER_LIVE,
})

const ledgerLegacyConnector = new LedgerConnector({
  chainId: CHAIN_ID,
  url: ETH_RPC_URL,
  baseDerivationPath: LEDGER_DERIVATION_PATHS.LEDGER_LEGACY,
})

const trezorConnector = new TrezorConnector({
  chainId: CHAIN_ID,
  pollingInterval: 1000,
  requestTimeoutMs: 1000,
  config: {
    chainId: CHAIN_ID,
  },
  url: ETH_RPC_URL,
  manifestEmail: "contact@keep.network",
  manifestAppUrl: "https://localhost",
})

// Wallets.
const WALLETS = [
  {
    name: "Metamask",
    icon: "/images/metamask-fox.svg",
    connector: injectedConnector,
  },
  {
    name: "Ledger Legacy",
    icon: "/images/ledger.svg",
    connector: ledgerLegacyConnector,
    isHardwareWallet: true,
    withAccountPagination: true,
  },
  {
    name: "Ledger Live",
    icon: "/images/ledger.svg",
    connector: ledgerLiveConnector,
    isHardwareWallet: true,
    withAccountPagination: true,
  },
  {
    name: "Trezor",
    icon: "/images/trezor.svg",
    connector: trezorConnector,
    isHardwareWallet: true,
  },
]

export const ConnectWalletDialog = ({ shown, onConnected, onClose }) => {
  const { active, account, activate } = useWeb3React()

  const [chosenWallet, setChosenWallet] = useState({})
  const [error, setError] = useState(null)
  const [availableAccounts, setAvailableAccounts] = useState([])
  const [isFetching, setIsFetching] = useState(false)
  const [accountsOffset, setAccountsOffset] = useState(0)

  useEffect(() => {
    let shoudlSetState = true

    if (
      chosenWallet.isHardwareWallet &&
      chosenWallet.name &&
      chosenWallet.name.includes("Ledger")
    ) {
      setIsFetching(true)
      chosenWallet.connector
        .getAccounts(5, accountsOffset)
        .then((accounts) => {
          if (shoudlSetState) {
            setAvailableAccounts(accounts)
            setIsFetching(false)
          }
        })
        .catch((error) => {
          if (shoudlSetState) {
            setIsFetching(false)
            setError(error.toString())
          }
        })
    }

    return () => {
      shoudlSetState = false
    }
  }, [accountsOffset, chosenWallet])

  async function chooseWallet(wallet) {
    try {
      setChosenWallet(wallet)
      if (wallet.isHardwareWallet) {
        await wallet.connector.activate()
        if (!wallet.withAccountPagination) {
          setAvailableAccounts(await wallet.connector.getAccounts())
        }
      } else {
        await activateProvider(null, wallet)
      }
    } catch (error) {
      setError(error.toString())
    }
  }

  const activateProvider = async (selectedAccount, wallet = chosenWallet) => {
    try {
      if (wallet.isHardwareWallet) {
        wallet.connector.setDefaultAccount(selectedAccount)
      }
      await activate(wallet.connector, undefined, true)
      onConnected()
    } catch (ex) {
      setError(ex.toString())
    }
  }

  const reconnectWallet = async () => {
    setError(null)
    await chooseWallet(chosenWallet)
  }

  return (
    <div className={`modal connect-wallet ${shown ? "open" : "closed"}`}>
      <div className="modal-body">
        <div className="close">
          <div className="x" onClick={onClose}>
            &#9587;
          </div>
        </div>
        {!chosenWallet.name && (
          <ChooseWalletStep onChooseWallet={chooseWallet} />
        )}
        {chosenWallet.name && !active && (
          <ConnectToWalletStep
            wallet={chosenWallet}
            error={error}
            onTryAgainClick={reconnectWallet}
          />
        )}
        {chosenWallet.name && active && (
          <ConnectedView wallet={chosenWallet} account={account} />
        )}
        <ChooseAccount
          wallet={chosenWallet}
          availableAccounts={availableAccounts}
          active={active}
          onAccountSelect={activateProvider}
          withPagination={chosenWallet && chosenWallet.withAccountPagination}
          onNext={() => setAccountsOffset((prevOffset) => prevOffset + 5)}
          onPrev={() => setAccountsOffset((prevOffset) => prevOffset - 5)}
          shouldDisplayPrev={accountsOffset > 0}
          isFetching={isFetching}
        />
      </div>
    </div>
  )
}

ConnectWalletDialog.propTypes = {
  shown: PropTypes.bool,
  onConnected: PropTypes.func,
  onClose: PropTypes.func,
}

const ChooseWalletStep = ({ onChooseWallet }) => {
  return (
    <>
      <div className="title">Connect to a wallet</div>
      <p>This wallet will be used to sign transactions on Ethereum.</p>

      <ul className="wallets">
        {WALLETS.map((wallet) => {
          return (
            <li
              key={wallet.name}
              className="wallet-option"
              onClick={() => onChooseWallet(wallet)}
            >
              <img alt="wallet-icon" src={wallet.icon} />
              {wallet.name}
            </li>
          )
        })}
      </ul>
    </>
  )
}

ChooseWalletStep.propTypes = {
  onChooseWallet: PropTypes.func,
}

const ConnectToWalletStep = ({ error, wallet, onTryAgainClick }) => {
  if (error) {
    return (
      <ErrorConnecting
        error={error}
        wallet={wallet}
        onTryAgainClick={onTryAgainClick}
      />
    )
  }

  if (wallet.name.includes("Ledger")) {
    return (
      <>
        <div className="title">Plug In Ledger & Enter Pin</div>
        <p>
          Open Ethereum application and make sure Contract Data and Browser
          Support are enabled.
        </p>
        <p>Connecting...</p>
      </>
    )
  }

  return (
    <>
      <div className="title">Connect to a wallet</div>
      <p>Connecting to {wallet.name} wallet...</p>
    </>
  )
}

ConnectToWalletStep.propTypes = {
  error: PropTypes.string,
  wallet: PropTypes.object,
  onTryAgainClick: PropTypes.func,
}

const ChooseAccount = ({
  wallet,
  availableAccounts,
  active,
  onAccountSelect,
  withPagination,
  onNext,
  onPrev,
  shouldDisplayPrev,
  isFetching,
}) => {
  if (isFetching) {
    return <div>Loading wallet accounts...</div>
  } else if (
    wallet.isHardwareWallet &&
    availableAccounts.length !== 0 &&
    !active
  ) {
    return (
      <>
        <div className="title mb-2">Select account</div>
        {availableAccounts.map((account) => (
          <div
            key={account}
            className="cursor-pointer mb-1"
            onClick={() => onAccountSelect(account)}
          >
            {account}
          </div>
        ))}
        {withPagination && (
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            {shouldDisplayPrev && (
              <span className="cursor-pointer" onClick={onPrev}>
                prev
              </span>
            )}
            <span
              className="cursor-pointer"
              style={{ marginLeft: "auto" }}
              onClick={onNext}
            >
              next
            </span>
          </div>
        )}
      </>
    )
  }

  return null
}

ChooseAccount.propTypes = {
  wallet: PropTypes.object,
  availableAccounts: PropTypes.arrayOf(PropTypes.string),
  active: PropTypes.bool,
  onAccountSelect: PropTypes.func,
  onNext: PropTypes.func,
  onPrev: PropTypes.func,
  shouldDisplayPrev: PropTypes.bool,
  isFetching: PropTypes.bool,
  withPagination: PropTypes.bool,
}

const ConnectedView = ({ wallet, account }) => {
  return (
    <div className="connected-view">
      <div className="title">Wallet connected</div>
      <div className="details">
        <p>{wallet.name}</p>
        <p>Account: {account}</p>
      </div>
    </div>
  )
}

ConnectedView.propTypes = {
  wallet: PropTypes.shape({
    name: PropTypes.string,
  }),
  account: PropTypes.string,
}

const ErrorConnecting = ({ wallet, error, onTryAgainClick }) => {
  return (
    <>
      <div className="title">Connect to a wallet</div>
      <p>Error connecting to {wallet.name} wallet...</p>
      <span onClick={onTryAgainClick}>Try Again</span>
      {error && <p>{error}</p>}
    </>
  )
}

ErrorConnecting.propTypes = {
  wallet: PropTypes.shape({
    name: PropTypes.string,
  }),
  error: PropTypes.string,
  onTryAgainClick: PropTypes.func,
}
