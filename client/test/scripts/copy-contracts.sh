#!/bin/bash
# This script copies test contracts artifacts for tests execution.

SOURCE_DIR=$(realpath $(dirname $0)/../data/contracts)
DESTINATION_DIR=$(realpath $(dirname $0)/../../src/eth/artifacts)

function copy_contracts() {
    cp $SOURCE_DIR/** $DESTINATION_DIR/
}

echo "Copy contracts artifacts"
echo "Source: ${SOURCE_DIR}"
echo "Destination: ${DESTINATION_DIR}"
copy_contracts
