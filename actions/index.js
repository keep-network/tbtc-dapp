import { createActions, handleActions, combineActions } from 'redux-actions';
import { REQUEST_A_DEPOSIT } from '../sagas'

export function requestADeposit() {
    return {
        type: REQUEST_A_DEPOSIT
    }
}


// const defaultState = { counter: 10 };

// const { increment, decrement } = createActions({
//   INCREMENT: (amount = 1) => ({ amount }),
//   DECREMENT: (amount = 1) => ({ amount: -amount })
// });

// const reducer = handleActions(
//   {
//     [combineActions(increment, decrement)]: (
//       state,
//       { payload: { amount } }
//     ) => {
//       return { ...state, counter: state.counter + amount };
//     }
//   },
//   defaultState
// );

// export default reducer;
