# tBTC dApp

## Development

`npm start` runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

## Docker

To build a Docker image execute:
```sh
docker build . -t tbtc-dapp
```

To run the Docker image execute:
```sh
docker run -p 8080:80 tbtc-dapp
```

This will expose the app under [http://localhost:8080](http://localhost:8080).

## Internal TestNet

To access the internal tBTC TestNet you need to be connected to it via VPN.
Contracts with which the app is interacting are deployed under the following
addresses:

| Name           | Address                                    |
| -------------- | ------------------------------------------ |
| Deposit        | 0xfA9F14f9fd9de1f946b436f12A822CCa578de070 |
| DepositFactory | 0x3d1B628d12732Ac603Fd9d97f59b280A89Eef9e3 |
| KeepBridge     | 0x2592ddC02be8eA8054fd76cEA895f892A577C0BA |
| TBTCSystem     | 0xb3f7c202Cf2789A592D5ad43B681D6693e6e6024 |
| TBTCToken      | 0x46c3884E5242b2330215e71E2F9907bdfB5A5cb3 |

### MetaMask

Add custom network to your MetaMask:<br>
**RPC URL**: `http://eth-tx-node.default.svc.cluster.local:8545`<br>
**ChainID**: `1101`<br>

*Note*: It was confirmed to work on Chrome browser, there were some problems with
connection to the custom RPC on Firefox.
