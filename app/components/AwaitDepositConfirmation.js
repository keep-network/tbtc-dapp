import styled from 'styled-components'
import { PageTemplate } from './PageTemplate'
import { MainBlock } from "./MainBlock";
import Link from 'next/link'
import { IconBlock, ContentBlock, FormStep } from './FormStep';
import { DarkGray } from '../styles';

const QRCode = require('qrcode.react')


const CopyAddressBox = styled.div`
    background: #ddd;
    border: 1px solid #ddd;
    display: inline-block;
    padding: 1em;
    width: 420px;
    color: ${DarkGray};
`

const WaitingForTx = styled.div`
    text-align: center;
    i {
        font-size: 64px;
        display: block;
        clear: both;
    }
`

const AwaitDepositConfirmation = ({ address }) => {
    return <PageTemplate>
        <MainBlock>
            <FormStep>
                <IconBlock>
                    <WaitingForTx>
                        <img src='/static/waiting.png'/>
                    </WaitingForTx>
                </IconBlock>

                <ContentBlock>
                    <h2>Pay 1 BTC</h2>
                    <p>Scan the QR code or tap to pay, or copy the address below into your wallet</p>

                    <CopyAddressBox>
                        {address}
                    </CopyAddressBox>

                    <br/><br/>
                    <a style={{ color: '#333', textDecoration: 'none' }} href="/prove-deposit">[debug] let's prove our deposit and claim tbtc</a>
                </ContentBlock>
            </FormStep>
        </MainBlock>
    </PageTemplate>
}

export { AwaitDepositConfirmation }