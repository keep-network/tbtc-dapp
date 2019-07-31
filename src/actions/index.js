export const REQUEST_A_DEPOSIT = 'REQUEST_A_DEPOSIT'
export const WAIT_CONFIRMATION = 'WAIT_CONFIRMATION'
export const SUBMIT_DEPOSIT_PROOF = 'SUBMIT_DEPOSIT_PROOF'

export function requestADeposit({ history }) {
    return {
        history,
        type: REQUEST_A_DEPOSIT
    }
}

export function waitConfirmation({ history }) {
    return {
        history,
        type: WAIT_CONFIRMATION
    }
}

export function submitProof({ history }) {
    return {
        history,
        type: SUBMIT_DEPOSIT_PROOF
    }
}