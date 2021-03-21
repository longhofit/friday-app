import {
  GET_EMPLOYESS,
  GetEmployessAction,
} from './types';

export const onGetEmployees = (payload: []): GetEmployessAction => ({
  type: GET_EMPLOYESS,
  payload,
});
