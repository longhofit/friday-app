export interface UserState {
  email: string;
  name: string;
  sub: string;
  role: string;
}

export const SET_USER = 'SET_USER';
export const SET_ROLE = 'SET_ROLE';


export interface SetUserAction {
  type: typeof SET_USER;
  payload: UserState;
}

export interface SetRoleAction {
  type: typeof SET_ROLE;
  payload: string;
}


export type UserActionTypes = SetUserAction | SetRoleAction;
