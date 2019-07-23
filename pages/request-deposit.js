import { Button } from "../components/Button";
import Link from 'next/link'

const RequestDeposit = () => {
    return <div>

        <h2>Put down a small bond</h2>
        <p>Don't worry, you'll get it back! It's just an anti-spam measure</p>
        <Link href="/initiate-deposit">
            <Button>Pay</Button>
        </Link>
    </div>
}

export default RequestDeposit