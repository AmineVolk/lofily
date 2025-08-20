import update from 'immutability-helper';

import { set } from '../helper';

export const updateAction = (dispatch) => (objectPath, value, index) =>
  dispatch({ type: 'UPDATE', objectPath, value, index });

export const removeAction = (dispatch) => (objectPath) =>
  dispatch({ type: 'REMOVE', objectPath });

export const appendAction = (dispatch) => (objectPath, value) =>
  dispatch({ type: 'APPEND', objectPath, value });

export const removeActionReducerCase = (state, action) => {
  const remainingPath = [...action.objectPath];
  const arrayIndex = parseInt(remainingPath.pop());

  if (remainingPath.length === 1) {
    return update(state, {
      [remainingPath[0]]: (arr) => arr.filter((item, i) => i !== arrayIndex),
    });
  }

  const arrayField = remainingPath.pop();

  const pathObject = set({}, remainingPath.join('.'), {
    [arrayField]: (arr) => arr.filter((item, i) => i !== arrayIndex),
  });

  return update(state, pathObject);
};
export const updateActionReducerCase = (state, action) => {
  const shouldUpdateObjectFromArray = typeof action.index === 'number';

  if (shouldUpdateObjectFromArray) {
    // the last element is the target array

    const pathObject = set({}, action.objectPath.join('.'), {
      [action.index]: { $set: action.value },
    });
    return update(state, pathObject);
  }

  let pathObject = set({}, action.objectPath.join('.'), {
    $set: action.value,
  });

  return update(state, pathObject);
};

export const appendActionReducerCase = (state, action) => {
  const pathObject = {};

  action.objectPath.reduce((path, key) => {
    path.reduce((node, key) => node[key], pathObject)[key] =
      path.length === action.objectPath.length - 1
        ? { $push: [action.value] }
        : {};
    return [...path, key];
  }, []);

  return update(state, pathObject);
};
