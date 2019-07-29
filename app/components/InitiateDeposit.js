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
    margin-bottom: 1em;
`

const InitiateDeposit = ({ address }) => {
    return <PageTemplate>
        <MainBlock>
            <FormStep>
                <IconBlock>
                    <QRCode size={160} value={address || ''}/>
                </IconBlock>

                <ContentBlock>
                    <h2>Pay 1 BTC</h2>
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

export { InitiateDeposit }