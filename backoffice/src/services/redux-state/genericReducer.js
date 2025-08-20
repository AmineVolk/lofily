import { appendActionReducerCase, removeActionReducerCase, updateActionReducerCase } from './actions';

export const genericReducer = (state = {}, action) => {
  switch (action.type) {
    case 'INITIALIZE':
      return {
        ...state,
        ...action.initialState,
        __initialized: true,
      };

    case 'UPDATE':
      return updateActionReducerCase(state, action);

    case 'REMOVE':
      return removeActionReducerCase(state, action);

    case 'APPEND':
      return appendActionReducerCase(state, action);

    default:
      return state;
  }
};
