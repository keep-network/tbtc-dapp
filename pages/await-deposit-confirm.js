import styled from 'styled-components'
import { PageTemplate } from '../components/PageTemplate'
import { MainBlock } from "../components/MainBlock";
import Link from 'next/link'
import { IconBlock, ContentBlock, FormStep } from '../components/FormStep';

const QRCode = require('qrcode.react')


const CopyAddressBox = styled.div`
    background: #ddd;
    border: 1px solid #ddd;
    display: inline-block;
    padding: 1em;
    color: #666;
`

const WaitingForTx = styled.div`
    text-align: center;
    i {
        font-size: 64px;
        display: block;
        clear: both;
    }
`

const AwaitDepositConfirmation = () => {
    const address = '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa'
    return <PageTemplate>
        <MainBlock>
            <FormStep>
                <IconBlock>
                    <WaitingForTx>
                        <i class="fas fa-hourglass"></i>
                        <span>Waiting for a confirmation</span>
                    </WaitingForTx>
                </IconBlock>

                <ContentBlock>
                    <h1>Pay 1 BTC</h1>
                    <p>Scan the QR code or tap to pay, or copy the address below into your wallet</p>

                    <CopyAddressBox>
                        {address}
                    </CopyAddressBox>

                    <br/>
                    <Link href="/prove-deposit">next to prove deposit</Link>
                </ContentBlock>
            </FormStep>
        </MainBlock>
    </PageTemplate>
}

export default AwaitDepositConfirmation