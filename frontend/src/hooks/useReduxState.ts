import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import {
  appendAction,
  removeAction,
  updateAction,
} from 'src/services/redux-state/actions';

import { StoreType } from '@/services/redux-state/Store';

export enum ActionType {
  update = 'update',
  append = 'append',
  remove = 'remove',
}

type UpdateActionType = (objectPath: string[], value: unknown) => void;
type RemoveActionType = (objectPath: string[]) => void;
type AppendActionType = (objectPath: string[], value: unknown) => void;

type UseReduxActionType = {
  [ActionType.update]: UpdateActionType;
  [ActionType.remove]: RemoveActionType;
  [ActionType.append]: AppendActionType;
};

export const useReduxActions = (): UseReduxActionType => {
  const dispatch = useDispatch();
  return {
    update: (objectPath: string[], value: unknown) =>
      updateAction(dispatch)(objectPath, value),
    remove: (objectPath: string[]) => removeAction(dispatch)(objectPath),
    append: (objectPath: string[], value: unknown) =>
      appendAction(dispatch)(objectPath, value),
  };
};

type UseReduxStateType = [StoreType, UseReduxActionType];

// stateToSelect is string like : "state1,state2"
export const useReduxState = (stateToSelect: string): UseReduxStateType => {
  const updateActions = useReduxActions();
  const allState = (state: StoreType) => state;
  const filterStateSelector = eval(
    `({${stateToSelect}}) => ({${stateToSelect}})`
  );
  const currentSelector = stateToSelect ? filterStateSelector : allState;
  return [useSelector(currentSelector, shallowEqual), updateActions];
};
