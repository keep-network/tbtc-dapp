import Link from 'next/link'
import { Button } from '../components/Button'

import { PageTemplate } from '../components/PageTemplate'
import { MainBlock } from "../components/MainBlock"
import { IconBlock, FormStep, ContentBlock } from './FormStep';

const TBTCMinted = ({ txHash }) => {
    return <PageTemplate>
        <MainBlock>
            <FormStep>
                <IconBlock>
                    <img src='/static/festival.png'/>
                </IconBlock>

                <ContentBlock>
                    <h2>Congratulations!</h2>
                    <p>You're the proud owner of 0.995 tBTC</p>

                    <a href={`https://etherscan.io/token/${txHash}`}>
                        <Button>View on Etherscan</Button>
                    </a>
                </ContentBlock>
            </FormStep>

        </MainBlock>
    </PageTemplate>
}
export { TBTCMinted }