import styled from 'styled-components'
const QRCode = require('qrcode.react')
import Link from 'next/link'
import { Button } from '../components/Button'
import { PageTemplate } from '../components/PageTemplate'
import { MainBlock } from "../components/MainBlock"
import { IconBlock, FormStep, ContentBlock } from '../components/FormStep';

const CopyAddressBox = styled.div`
    background: white;
    border: 1px solid #ddd;
    display: inline-block;
    padding: 1em;
`

const InitiateDeposit = () => {
    const address = '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa'
    return <PageTemplate>
        <MainBlock>
            <FormStep>
                <IconBlock>
                    <QRCode value={address}/>
                </IconBlock>

                <ContentBlock>
                    <h1>Pay 1 BTC</h1>
                    <p>Scan the QR code or tap to pay, or copy the address below into your wallet</p>

                    <CopyAddressBox>
                        {address}
                    </CopyAddressBox>

                    <br/>
                    <Link href="/await-deposit-confirm">
                        <Button>Ok, I sent it!</Button>
                    </Link>
                </ContentBlock>

            </FormStep>
        </MainBlock>
    </PageTemplate>
}

export default InitiateDeposit