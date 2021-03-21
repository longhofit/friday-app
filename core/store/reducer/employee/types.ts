export interface EmployeeState {
  employees: [];
}

export const GET_EMPLOYESS = 'GET_EMPLOYESS';

export interface GetEmployessAction {
  type: typeof GET_EMPLOYESS;
  payload: [];
}

export type EmployessActionTypes = GetEmployessAction;
