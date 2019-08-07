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
| Deposit        | 0xb6DA25a12F6E68CEE445e3Ae5953A07B9884A6a9 |
| DepositFactory | 0xEc258E27825FC283fC5e3E817CD8c4F61F6a6614 |
| KeepBridge     | 0x68B40b654C5058b9CC42Da9fAB4aB4537662b74D |
| TBTCSystem     | 0xFC1738a42417dc64a620Fee7F976ec20c27baF23 |
| TBTCToken      | 0xACeFDe79B10dAb55039Ef3AAFEdaAD54d0fd867E |

### MetaMask

Add custom network to your MetaMask:<br>
**RPC URL**: `http://eth-tx-node.default.svc.cluster.local:8545`<br>
**ChainID**: `1101`<br>

*Note*: It was confirmed to work on Chrome browser, there were some problems with
connection to the custom RPC on Firefox.
