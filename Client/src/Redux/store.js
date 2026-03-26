import { configureStore } from '@reduxjs/toolkit';
import RootReducers from './rootReducers';
import {thunk} from 'redux-thunk';

export const store = configureStore({
  reducer: RootReducers,
  devTools: true,
})