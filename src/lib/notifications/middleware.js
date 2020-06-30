import { iconPath } from ".";
import { NEW_NOTIFICATION } from './actions'

export default store => next => action => {
    if(action.type === NEW_NOTIFICATION) {
        new Notification('tBTC', {
            body: action.payload.body,
            icon: iconPath
        })
    }

    next(action)
}