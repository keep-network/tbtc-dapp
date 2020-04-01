import Web3 from "web3";
import createLedgerSubprovider from "@ledgerhq/web3-subprovider";
import TransportU2F from "@ledgerhq/hw-transport-u2f";
import ProviderEngine from "web3-provider-engine";
import WebsocketSubprovider from 'web3-provider-engine/subproviders/websocket'
import { AbstractConnector } from '@web3-react/abstract-connector' 


/**
 * An implementation of a LedgerConnector for web3-react, based on the original
 * @web3-react/ledger-connector.
 * 
 * Allows direct access to the LedgerJS client (useful for custom BTC logic), and 
 * uses WebSockets instead of HTTP JSON-RPC.
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
    super({
      supportedChainIds: [chainId]
    })
    this.chainId = chainId
    this.url = url
    this.pollingInterval = pollingInterval
    this.requestTimeoutMs = requestTimeoutMs
    this.accountFetchingConfigs = accountFetchingConfigs
    this.baseDerivationPath = baseDerivationPath

    this.ledgerSubprovider = null
  }

  /**
   * @returns {Promise<Object>}
   */
  async activate(): Promise {
    if (!this.provider) {
      const engine = new ProviderEngine();

      const getTransport = () => TransportU2F.create();
      const ledger = createLedgerSubprovider(getTransport, {
        accountsLength: 1,
        networkId: await this.getChainId()
      })

      this.ledgerSubprovider = ledger
      
      engine.addProvider(ledger)

      engine.addProvider(new WebsocketSubprovider({ 
        rpcUrl: this.url 
      }))

      engine.start()

      this.provider = engine
    }

    this.provider.start()

    return { provider: this.provider, chainId: this.chainId }
  }

  /**
   * @returns {Promise<Web3ProviderEngine>}
   */
  async getProvider() {
    return this.provider
  }

  /**
   * @returns {Promise<number>}
   */
  async getChainId() {
    return this.chainId
  }

  /**
   * @returns {Promise<null>}
   */
  async getAccount() {
    if (!this.provider) {
      return null
    }
    
    return new Promise((resolve, reject) => { 
      console.debug(`Ledger - loading accounts...`)
      this.ledgerSubprovider.getAccounts((error, accounts) => {
        if(error) {
          return reject(error)
        }
        console.debug(`Ledger - loaded ${accounts.length} accounts...`)
        resolve(accounts[0])
      })
    })
  }

  deactivate() {
    this.provider.stop()
  }
}
