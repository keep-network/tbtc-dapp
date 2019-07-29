import { Button } from "./Button";
import styled from 'styled-components'
import Link from 'next/link'
import { PageTemplate } from './PageTemplate'
import { MainBlock } from "./MainBlock"
import { FormStep, IconBlock, ContentBlock } from '../components/FormStep'

const RequestDeposit = ({ requestADeposit }) => {
    return <PageTemplate>
        <MainBlock>
            <FormStep>
                <IconBlock>
                    <img src='/static/metamask-wolf.png'/>
                </IconBlock>
                <ContentBlock>
                    <h2>Put down a small bond</h2>
                    <p>Don't worry, you'll get it back! It's just an anti-spam measure</p>
                    <Button onClick={requestADeposit}>Pay</Button>
                </ContentBlock>
            </FormStep>
        </MainBlock>
    </PageTemplate>
    
}

export { RequestDeposit }