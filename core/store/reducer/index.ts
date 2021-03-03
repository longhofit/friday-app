import { combineReducers } from 'redux';
import { sessionReducer } from './session';
import { userReducer } from './user';

export const rootReducer = combineReducers({
  user: userReducer,
  session: sessionReducer,
});