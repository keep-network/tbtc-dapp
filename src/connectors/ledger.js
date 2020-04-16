import AppEth from '@ledgerhq/hw-app-eth'
import TransportU2F from "@ledgerhq/hw-transport-u2f"
import { AbstractConnector } from '@web3-react/abstract-connector'
import { ConnectorUpdate } from '@web3-react/types'
import Web3ProviderEngine from 'web3-provider-engine'
import { LedgerSubprovider } from './ledger_subprovider'
import { MetamaskSubprovider } from './metamask_subprovider'

/**
 * An implementation of a LedgerConnector for web3-react, based on the original
 * `@web3-react/ledger-connector`.
 * 
 * Some differences:
 * 
 * 1. Sensible defaults for LedgerJS signing request timeouts.
 * 2. Uses Metamask-injected provider, rather than requiring an RPC URL to be specified.
 * 3. Uses our implementation of a Ledger subprovider, which works correclty for chainId's > 255.
 */
export class LedgerConnector extends AbstractConnector {
  engine
  provider
  ledgerSubprovider

  constructor({
    chainId,
    pollingInterval,
    accountFetchingConfigs,
    baseDerivationPath
  }) {
    super({ supportedChainIds: [chainId] })

    this.chainId = chainId
    this.pollingInterval = pollingInterval
    this.accountFetchingConfigs = accountFetchingConfigs
    this.baseDerivationPath = baseDerivationPath
  }

  /**
   * @return {Promise<ConnectorUpdate>}
   */
  async activate() {
    if (!this.provider) {
      let ledgerEthereumClientFactoryAsync = async () => {
        const ledgerConnection = await TransportU2F.create()
        // Ledger will automatically timeout the U2F "sign" request after `exchangeTimeout` ms.
        // The default is set at an annoyingly low threshold, of 10,000ms, wherein the connection breaks
        // and throws this cryptic error:
        //   `{name: "TransportError", message: "Failed to sign with Ledger device: U2F DEVICE_INELIGIBLE", ...}`
        // Here we set it to 3hrs, to avoid this occurring, even if the user leaves the tab
        // open and comes back to it later.
        ledgerConnection.setExchangeTimeout(10800000)
        const ledgerEthClient = new AppEth(ledgerConnection)
        return ledgerEthClient
      }

      const engine = new Web3ProviderEngine({ pollingInterval: this.pollingInterval })
      
      // Ledger.
      const ledgerSubprovider = new LedgerSubprovider({
        chainId: this.chainId,
        ledgerEthereumClientFactoryAsync,
        accountFetchingConfigs: this.accountFetchingConfigs,
        baseDerivationPath: this.baseDerivationPath
      })
      this.ledgerSubprovider = ledgerSubprovider
      engine.addProvider(ledgerSubprovider)

      // Metamask.
      let metamaskProvider = new MetamaskSubprovider()
      await metamaskProvider.enable()
      engine.addProvider(metamaskProvider)

      engine.start()
      this.engine = engine
      this.provider = engine
    }

    return { provider: this.provider, chainId: this.chainId }
  }

  /**
   * @return {Promise<Web3ProviderEngine>}
   */
  async getProvider() {
    return this.provider
  }

  /**
   * @return {Promise<number>}
   */
  async getChainId() {
    return this.chainId
  }

  /**
   * @return {Promise<null>}
   */
  async getAccount() {
    return this.ledgerSubprovider.getAccountsAsync(1).then(accounts => accounts[0])
  }

  deactivate() {
    this.engine.stop()
  }
}