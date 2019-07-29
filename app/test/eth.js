import { createDeposit } from "../chain/eth";


describe('Ethereum code', async () => {
    it('#createDeposit', async () => {
        let addr = await createDeposit()
        expect(addr).to.equal('0x123')
    })
})