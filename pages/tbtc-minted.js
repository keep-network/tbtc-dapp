
import Link from 'next/link'
import { Button } from '../components/Button'


const TBTCMinted = () => {
    return <div>
        <h2>Congratulations!</h2>
        <p>You're the proud owner of 0.995 tBTC</p>

        <a href="https://etherscan.io/token/0x2260fac5e5542a773aa44fbcfedf7c193bc2c599">
            <Button>View on Etherscan</Button>
        </a>

    </div>
}
export default TBTCMinted