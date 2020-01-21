#!/bin/bash
# 
# This is a temporary tool to copy the most recent artifacts of tBTC
# into this package.
# 
# TODO: just for development, until we get artifacts uploaded somewhere properly.
set -ex

for CONTRACT in Deposit TBTCSystem TBTCConstants TBTCToken DepositOwnerToken DepositFactory FeeRebateToken VendingMachine; do
    cp ../../../../tbtc/implementation/build/contracts/$CONTRACT.json artifacts/
done

for CONTRACT in ECDSAKeep; do
    cp ../../../../keep-tecdsa/solidity/build/contracts/$CONTRACT.json artifacts/
done

# Can easily replace later with:
# wget s3.amazonaws.com/keep/testnet/ABC.json
