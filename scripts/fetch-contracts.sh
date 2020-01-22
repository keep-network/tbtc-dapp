#!/bin/bash
# This script fetches contracts artifacts published to the GCP bucket. It is expected
# that `CONTRACT_DATA_BUCKET` environment variable is set to the name of a
# bucket from which contracts should be downloaded. The script is expected to be
# run from the repository root.
# 
# Sample execution command:
# CONTRACT_DATA_BUCKET=keep-dev-contract-data scripts/fetch-contracts.sh
set -ex

CONTRACTS_PATHS=(
  "tbtc/Deposit.json" 
  "tbtc/DepositFactory.json" 
  "tbtc/TBTCConstants.json"
  "tbtc/TBTCSystem.json"
  "tbtc/TBTCToken.json"
  "tbtc/DepositOwnerToken.json"
  "tbtc/FeeRebateToken.json"
  "tbtc/VendingMachine.json"
  "keep-tecdsa/ECDSAKeep.json"
  )

DESTINATION_ROOT=client/src/eth
DESTINATION_DIR=artifacts

if [ ! -d $DESTINATION_ROOT ]; then
  echo "Expected a directory $DESTINATION_ROOT to exist. Exiting."
  exit 1
fi

function create_destination_dir() {
  mkdir -p $DESTINATION_ROOT/$DESTINATION_DIR
}

function fetch_contracts() {
  for CONTRACT_PATH in ${CONTRACTS_PATHS[@]}
  do
    gsutil -q cp gs://${CONTRACT_DATA_BUCKET}/${CONTRACT_PATH} $DESTINATION_ROOT/$DESTINATION_DIR
  done
}

echo "Fetch contracts artifacts to: ${DESTINATION_DIR}"
create_destination_dir
fetch_contracts
