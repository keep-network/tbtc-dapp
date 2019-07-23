import styled from 'styled-components'
const QRCode = require('qrcode.react')
import Link from 'next/link'
import { Button } from '../components/Button'

const CopyAddressBox = styled.div`
    background: white;
    border: 1px solid #ddd;
    display: inline-block;
    padding: 1em;
`

const InitiateDeposit = () => {
    const address = '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa'
    return <div>
        <QRCode value={address}/>

        <h1>Pay 1 BTC</h1>
        <p>Scan the QR code or tap to pay, or copy the address below into your wallet</p>

        <CopyAddressBox>
        {address}
        </CopyAddressBox>

        <Link href="/await-deposit-confirm">
            <Button>Ok, I sent it!</Button>
        </Link>
    </div>
}

export default InitiateDeposit