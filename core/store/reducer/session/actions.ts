import {
  SET_TOKEN,
  SetTokenAction,
} from './types';

export const onSetToken = (payload: string): SetTokenAction => ({
  type: SET_TOKEN,
  payload,
});
