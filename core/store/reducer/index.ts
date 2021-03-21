import { combineReducers } from 'redux';
import { employeeReducer } from './employee';
import { sessionReducer } from './session';
import { userReducer } from './user';

export const rootReducer = combineReducers({
  user: userReducer,
  session: sessionReducer,
  employee: employeeReducer,
});