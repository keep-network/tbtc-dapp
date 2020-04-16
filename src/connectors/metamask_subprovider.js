/** @typedef { import("@0x/subproviders").EIP1193Provider } Provider */

import { Subprovider } from "@0x/subproviders";

/**
 * A subprovider that forwards requests to Metamask.
 * 
 * As it relies on `window.ethereum`, it may work with other injected providers, though this
 * is not tested.
 */
class MetamaskSubprovider extends Subprovider {
    /** 
     * The injected MetaMask provider, eg. `window.ethereum`. 
     * @type {Provider}
     */
    metamask

    constructor() {
        super()
        this.metamask = window.ethereum
    }

    async enable() {
        await this.metamask.enable()
    }

    /**
     * @param {import("@0x/subproviders").JSONRPCRequestPayload} payload 
     * @param {import("@0x/subproviders").Callback} next 
     * @param {import("@0x/subproviders").ErrorCallback} end 
     * @return {Promise<void>}
     */
    async handleRequest(payload, next, end) {
        this.metamask.sendAsync(payload, (err, result) => {
            end(err, result && result.result)
        })
    }
}

export { MetamaskSubprovider }