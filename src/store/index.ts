import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';
import thunk from 'redux-thunk';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';

import timersReducer from './timers';

const rootReducer = combineReducers({
  timers: timersReducer,
});

export type RootReducer = ReturnType<typeof rootReducer>;

const isLocalStorage = true;

const persistedReducer = persistReducer<RootReducer>(
  {
    key: 'root',
    throttle: 200,
    storage: {
      // TODO: custom api
      getItem(key) {
        if (isLocalStorage) return storage.getItem(key);
      },
      removeItem(key) {
        if (isLocalStorage) return storage.removeItem(key);
      },
      setItem(key, value) {
        if (isLocalStorage) return storage.setItem(key, value);
      },
    },
    stateReconciler: autoMergeLevel2,
  },
  rootReducer,
);

const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== 'production',
  middleware: [thunk],
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;



export default store;
