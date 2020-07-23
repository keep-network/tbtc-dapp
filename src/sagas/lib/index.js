import { put } from 'redux-saga/effects'

export function* logError(errorActionType, error) {
    yield put({
        type: errorActionType,
        payload: {
            error: error.message,
        },
    })
    console.error(error)
}
