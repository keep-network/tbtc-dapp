import styled from 'styled-components'
const QRCode = require('qrcode.react')


const CopyAddressBox = styled.div`
    background: #ddd;
    border: 1px solid #ddd;
    display: inline-block;
    padding: 1em;
`

const AwaitDepositConfirmation = () => {
    const address = '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa'
    return <div>
        Waiting for transaction

        <h1>Pay 1 BTC</h1>
        <p>Scan the QR code or tap to pay, or copy the address below into your wallet</p>

        <CopyAddressBox>
        {address}
        </CopyAddressBox>
    </div>
}

export default AwaitDepositConfirmation