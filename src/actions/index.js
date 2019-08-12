export const REQUEST_A_DEPOSIT = 'REQUEST_A_DEPOSIT'
export const WAIT_CONFIRMATION = 'WAIT_CONFIRMATION'
export const SUBMIT_DEPOSIT_PROOF = 'SUBMIT_DEPOSIT_PROOF'
export const OPEN_MODAL = 'OPEN_MODAL'
export const CLOSE_MODAL = 'CLOSE_MODAL'
export const SET_RENDER_CONTENT = 'SET_RENDER_CONTENT'

export function requestADeposit() {
    return {
        type: REQUEST_A_DEPOSIT
    }
}

export function waitConfirmation() {
    return {
        type: WAIT_CONFIRMATION
    }
}

export function submitProof() {
    return {
        type: SUBMIT_DEPOSIT_PROOF
    }
}

export function openModal() {
    return {
        type: OPEN_MODAL
    }
}

export function closeModal() {
    return {
        type: CLOSE_MODAL
    }
}

export function setRenderContent(renderContent) {
    return {
        type: SET_RENDER_CONTENT,
        payload: {
            renderContent
        }
    }
}