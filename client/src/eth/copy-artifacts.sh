#!/bin/bash
set -ex

for CONTRACT in Deposit TBTCSystem TBTCToken KeepBridge DepositFactory; do
    cp ../../../../tbtc/implementation/build/contracts/$CONTRACT.json artifacts/
done

# Can easily replace later with:
# wget s3.amazonaws.com/keep/testnet/ABC.json