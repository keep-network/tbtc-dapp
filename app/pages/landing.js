import styled from 'styled-components'
import Link from 'next/link'
import { Button } from '../components/Button'
import { MainBlock } from '../components/MainBlock'

import {
    PageWrapper,
    PageContainer,
    HeaderBlock,
    TBTCTitle
} from '../components/PageTemplate'
import { DarkBlue } from '../styles';

const Hero = styled.div`
    margin: auto 0;
    color: ${DarkBlue};

    h1 {
        font-size: 3.6em;
        margin: 0;
    }
    p {
        max-width: 450px;
        opacity: 0.8;
        padding-bottom: 1em;
    }

`

const QuestionBlock = styled.div`
    flex: 1;
    text-align: center;
    padding: 2em 1em;
    max-height: 200px;
    background: white;
    color: ${DarkBlue};

    h2 {
        font-size: 2em;
    }
`

const Questions = styled.div`
    flex: 1;
    display: flex;
    flex-direction: row;

    text-align: center;
    align-items: center;
    justify-content: center;
}
`

const Question = styled.div`
    display: block;
    width: 300px;
    margin: 0 3em;
`


const Landing = () => {
    return <PageWrapper>
        <PageContainer>
        
        <HeaderBlock>
            <TBTCTitle>tbtc</TBTCTitle>
        </HeaderBlock>

        <MainBlock>
            <Hero>
                <h1>Bitcoin, on Ethereum</h1>
                <p>
                    Deposit BTC to mint TBTC, trustlessly. Redeem TBTC for BTC, trustlessly. No KYC, no middleman, no bullshit.
                </p>
                <Link href="/request-deposit"><Button>Make a Deposit</Button></Link>
            </Hero>
        </MainBlock>

        <QuestionBlock>
            <h2>Questions?</h2>
            <Questions>
                <Question>
                    <h3>Question One</h3>
                    <p>Far far away, behind the word mountains, far from the countries Vokalia and Consonantia</p>
                </Question>
                <Question>
                    <h3>Question Two</h3>
                    <p>Separated they live in Bookmarksgrove right at the coast of the Semantics, a large language ocean</p>
                </Question>
                <Question>
                    <h3>Question Three</h3>
                    <p>A small river named Duden flows by their place and supplies it with the necessary regelialia</p>
                </Question>
            </Questions>
        </QuestionBlock>
        
        </PageContainer>
    </PageWrapper>
}

export default Landing