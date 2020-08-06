# Testing with hardware wallets.

## Running the dApp on HTTPS

To test with hardware wallets, the dApp must be served over HTTPS. Run `HTTPS=true npm start` and access it at https://localhost:3000.

### Hardware wallets

## Trezor

To run the trezor hardware wallet emulator, follow these steps:

 1. [Download and run the trezor bridge](https://github.com/trezor/trezord-go).
 2. [Clone the Trezor repo](https://github.com/trezor/trezor-firmware/blob/master/docs/core/build/index.md)
 3. [Setup and run the emulator](https://github.com/trezor/trezor-firmware/blob/master/docs/core/emulator/index.md)

Connect to the Trezor in Metamask, and deposit some ether for testing.

## Ledger

We suggest testing with a physical Ledger wallet.