import { Button } from "../components/Button";
import styled from 'styled-components'
import Link from 'next/link'

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
    flex-direction: row;
    margin: 0em 4em;
`

const TBTCTitle = styled.div`
    font-size: 1.6em;
`


const PageTemplate = ({ children }) => {
    return <PageWrapper>
        <PageContainer>
        
        <HeaderBlock>
            <Link href="/">
                <TBTCTitle>tbtc</TBTCTitle>
            </Link>
        </HeaderBlock>

        {children}

    </PageContainer>
    </PageWrapper>
    
}

export { PageTemplate }