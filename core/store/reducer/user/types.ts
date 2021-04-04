export interface UserState {
  annualDaysUsed: number;
  dateOfBirth: string;
  id: string;
  phoneNumber:string;
  slackId:string;
  email: string;
  name: string;
  role: string;
}

export const SET_USER = 'SET_USER';
export const SET_ROLE = 'SET_ROLE';
export const CLEAR_USER = 'CLEAR_USER';


export interface SetUserAction {
  type: typeof SET_USER;
  payload: UserState;
}

export interface SetRoleAction {
  type: typeof SET_ROLE;
  payload: string;
}

export interface ClearUserAction {
  type: typeof CLEAR_USER;
}


export type UserActionTypes = SetUserAction | SetRoleAction | ClearUserAction;
