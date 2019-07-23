import { Button } from "../components/Button";
import styled from 'styled-components'
import Link from 'next/link'
import { PageTemplate } from '../components/PageTemplate'
import { MainBlock } from "../components/MainBlock";

const RequestDeposit = () => {
    return <PageTemplate>
        <MainBlock>
            <div>
                <h2>Put down a small bond</h2>
                <p>Don't worry, you'll get it back! It's just an anti-spam measure</p>
                <Link href="/initiate-deposit">
                    <Button>Pay</Button>
                </Link>
            </div>
        </MainBlock>
    </PageTemplate>
    
}

export default RequestDeposit