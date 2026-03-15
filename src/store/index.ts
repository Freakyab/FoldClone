import { combineReducers, configureStore } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';

import homeReducer from './slices/homeSlice';
import userReducer from './slices/userSlice';
import transactionReducer from './slices/transactionSlice';
import widgetsReducer from './slices/widgetsSlice';
import statementJobReducer from './slices/statementJobSlice';

const rootReducer = combineReducers({
  home: homeReducer,
  user: userReducer,
  transactions: transactionReducer,
  widgets: widgetsReducer,
  statementJob: statementJobReducer,
});

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['user', 'widgets', 'statementJob'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
