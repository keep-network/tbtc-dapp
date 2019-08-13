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
| Deposit        | 0xEe10E8766500713E6Afab48D0e9E6C1EcEb5b4eA |
| DepositFactory | 0xeaf438317eb5DEbC3d45262B31B77d25CAc49fD6 |
| KeepBridge     | 0xCB7bdb38cd5f34655E33F7192136785Bd89E3884 |
| TBTCSystem     | 0x73aA4d669030B2455442C340b3D3E10B8d79e87d |
| TBTCToken      | 0xd434F7131c4f560fd7384B04383392F128fB9981 |
| ECDSAKeep      | deployed via keep factory                  |

### MetaMask

Add custom network to your MetaMask:<br>
**RPC URL**: `http://eth-tx-node.default.svc.cluster.local:8545`<br>
**ChainID**: `1101`<br>

*Note*: It was confirmed to work on Chrome browser, there were some problems with
connection to the custom RPC on Firefox.
