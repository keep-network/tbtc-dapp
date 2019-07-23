import styled from 'styled-components'


const PageWrapper = styled.div`
    min-height: 100vh;

    display: flex;
	flex-direction: column;
	flex-wrap: nowrap;
	justify-content: flex-start;
	align-items: stretch;
    align-content: stretch;
    
`

const PageContainer = styled.div`
    
    display: flex;
    justify-content: space-around;
    flex-direction: column;
    flex: 1;
`

const HeaderBlock = styled.div`
    flex: 0 1;
    padding: 0em 0;
    margin: 2em 4em;
`

const MainBlock = styled.div`
    flex: 1;
    align-items: center;
    display: flex;
    margin: 0em 4em;
`

const TBTCTitle = styled.div`
    font-size: 1.6em;
`

const Hero = styled.div`
    h1 {
        font-size: 3.6em;
        margin-top: 0;
    }
    p {
        max-width: 450px;
    }
`

const QuestionBlock = styled.div`
    flex: 1;
    text-align: center;
    padding: 2em 1em;
    max-height: 200px;
    background: #ddd;

    background: #ddd;

    h1 {
        font-size: 1.6em;
    }
`

const Questions = styled.ul`
    flex: 1;
    text-align: center;
}
`

const Question = styled.li`
    display: block;
    width: 300px;

`

const Button = styled.button`
    padding: 1em;
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
                <Button>Make a Deposit</Button>
            </Hero>
        </MainBlock>

        <QuestionBlock>
            <h2>Questions?</h2>
            <Questions>
                <Question>
                    Foobar
                </Question>
                <Question>
                    Foobar
                </Question>
                <Question>
                    Foobar
                </Question>
            </Questions>
        </QuestionBlock>
        
        </PageContainer>
    </PageWrapper>
}

export default Landing