import { configureStore } from '@reduxjs/toolkit';
import backtestUiReducer from './slices/backtestUiSlice';

export const store = configureStore({
  reducer: {
    backtestUi: backtestUiReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
