import styled from 'styled-components'
import { PageTemplate } from '../components/PageTemplate'
import { MainBlock } from "../components/MainBlock";
import Link from 'next/link'

const QRCode = require('qrcode.react')


const CopyAddressBox = styled.div`
    background: #ddd;
    border: 1px solid #ddd;
    display: inline-block;
    padding: 1em;
`

const AwaitDepositConfirmation = () => {
    const address = '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa'
    return <PageTemplate>
        <MainBlock>
            <span>Waiting for transaction</span>
    
            <h1>Pay 1 BTC</h1>
            <p>Scan the QR code or tap to pay, or copy the address below into your wallet</p>

            <CopyAddressBox>
                {address}
            </CopyAddressBox>

            <Link href="/prove-deposit">next to prove deposit</Link>
        </MainBlock>
    </PageTemplate>
}

export default AwaitDepositConfirmation