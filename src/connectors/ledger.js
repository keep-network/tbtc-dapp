import TransportU2F from "@ledgerhq/hw-transport-u2f"
import AppEth from '@ledgerhq/hw-app-eth'
import { ConnectorUpdate } from '@web3-react/types'
import { AbstractConnector } from '@web3-react/abstract-connector'
import Web3ProviderEngine from 'web3-provider-engine'
import { LedgerSubprovider } from './ledger_subprovider'
import CacheSubprovider from 'web3-provider-engine/subproviders/cache.js'
import { RPCSubprovider } from '@0x/subproviders/lib/src/subproviders/rpc_subprovider' // https://github.com/0xProject/0x-monorepo/issues/1400
import WebsocketSubprovider from 'web3-provider-engine/subproviders/websocket'

/**
 * An implementation of a LedgerConnector for web3-react, based on the original
 * `@web3-react/ledger-connector`.
 * 
 * Some differences:
 * 
 * 1. The original doesn't expose the LedgerJS client API. 
 *    We will probably want access to this in future, eg. signing BTC transactions
 * 
 * 2. The original doesn't work with event subscriptions, as it assumes a HTTP RPC 
 *    endpoint. Event subscriptions use `eth_subscribe`, which Ganache does not 
 *    support out-of-the-box. Assuming a Websocket provider is simpler for our case.
 */
export class LedgerConnector extends AbstractConnector {
  constructor({
    chainId,
    url,
    pollingInterval,
    requestTimeoutMs,
    accountFetchingConfigs,
    baseDerivationPath
  }) {
    super({ supportedChainIds: [chainId] })

    this.chainId = chainId
    this.url = url
    this.pollingInterval = pollingInterval
    this.requestTimeoutMs = requestTimeoutMs
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
      engine.addProvider(
        new LedgerSubprovider({
          chainId: this.chainId,
          ledgerEthereumClientFactoryAsync,
          accountFetchingConfigs: this.accountFetchingConfigs,
          baseDerivationPath: this.baseDerivationPath
        })
      )
      engine.addProvider(new CacheSubprovider())
      engine.addProvider(new WebsocketSubprovider({ rpcUrl: this.url }))
      this.provider = engine
    }

    this.provider.start()

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
    return this.provider._providers[0].getAccountsAsync(1).then((accounts: string[]): string => accounts[0])
  }

  deactivate() {
    this.provider.stop()
  }
}