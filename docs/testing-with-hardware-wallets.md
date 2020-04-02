# Testing with hardware wallets.

## Running the dApp on HTTPS

You need to be connecting to the dApp through a HTTPS connection. We can do this by using `mitmproxy` -

`mitmdump -p 443 --mode reverse:http://localhost:3000/`

Then open the app on [https://localhost](https://localhost).

## Ledger

To-Do.

## Trezor

### Install and run emulator

```bash
git clone --recurse-submodules https://github.com/trezor/trezor-firmware.git\n
cd trezor-firmware/core
make build_unix
./emu.py
```

### Install and run the `trezord` daemon

```bash
go get github.com/trezor/trezord-go
go build github.com/trezor/trezord-go
./trezord-go -e 21324
```

### Setup Trezor Wallet

In order to start using Bitcoin testnet with Trezor, you need to run custom backend in Trezor Wallet.

Follow the instructions in [their guide](https://wiki.trezor.io/Bitcoin_testnet).

### Send funds

Connect to the wallet in Metamask, and deposit some ether for testing.

Now you're ready!