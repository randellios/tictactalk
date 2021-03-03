import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import mainReducer from './reducers/main';

export type RootState = ReturnType<typeof mainReducer>;

export const store = createStore(
  mainReducer,
  composeWithDevTools(applyMiddleware(thunk))
);

export default store;
