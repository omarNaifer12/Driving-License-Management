import { legacy_createStore as createStore,applyMiddleware} from 'redux';
import RootReducers from './rootReducers';
import {thunk} from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
export const store=createStore(
    RootReducers,
    composeWithDevTools(applyMiddleware(thunk))
);
