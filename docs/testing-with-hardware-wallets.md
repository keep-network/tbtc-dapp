# Testing with hardware wallets.

## Running the dApp on HTTPS

You need to be connecting to the dApp through a HTTPS connection. We can do this by using `mitmproxy` -

`mitmdump -p 443 --mode reverse:http://localhost:3000/`

Then open the app on [https://localhost](https://localhost).

## Ledger

To-Do.

## Trezor

### Setup Software

 - Install and [run the emulator](https://docs.trezor.io/trezor-firmware/core/emulator/index.html)
 - Install and run the [Trezor bridge daemon](https://github.com/trezor/trezord-go)


### Send funds

Connect to the Trezor in Metamask, and deposit some ether for testing.

Now you're ready!