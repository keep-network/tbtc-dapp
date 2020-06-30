import history from '../../history'
import { HISTORY_PUSH } from './actions';

export default store => next => action => {
    if(action.type === HISTORY_PUSH) {
        history.push(action.payload.path)
    }

    next(action)
}