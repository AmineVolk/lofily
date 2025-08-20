import { configureStore } from '@reduxjs/toolkit';
import PropTypes from 'prop-types';
import React from 'react';
import { Provider } from 'react-redux';
import logger from 'redux-logger';

import { genericReducer } from './genericReducer';
import { Store } from './Store';

export const StateProvider = ({ reducer, initialState, children }) => {
  const store = configureStore({
    reducer: reducer || genericReducer,
    devTools: process.env.NODE_ENV !== 'production',
    preloadedState: initialState || Store,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
  });

  return <Provider store={store}>{children}</Provider>;
};
StateProvider.propTypes = {
  children: PropTypes.node.isRequired,
  initialState: PropTypes.shape({}),
  reducer: PropTypes.func,
};
