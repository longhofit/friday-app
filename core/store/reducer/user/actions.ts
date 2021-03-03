import {
  SET_USER,
  SetUserAction,
  UserState,
  SetRoleAction,
  SET_ROLE,
} from './types';

export const onSetUser = (payload: UserState): SetUserAction => ({
  type: SET_USER,
  payload,
});

export const onSetRole = (payload: string): SetRoleAction => ({
  type: SET_ROLE,
  payload,
});