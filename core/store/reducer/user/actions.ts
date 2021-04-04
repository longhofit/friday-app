import {
  SET_USER,
  SetUserAction,
  UserState,
  SetRoleAction,
  SET_ROLE,
  ClearUserAction,
  CLEAR_USER,
} from './types';

export const onSetUser = (payload: UserState): SetUserAction => ({
  type: SET_USER,
  payload,
});

export const onSetRole = (payload: string): SetRoleAction => ({
  type: SET_ROLE,
  payload,
});

export const onClearUser = (): ClearUserAction => ({
  type: CLEAR_USER,
});