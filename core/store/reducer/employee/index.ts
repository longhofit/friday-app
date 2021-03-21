import {
  EmployeeState,
  EmployessActionTypes,
  GET_EMPLOYESS,
} from './types';

const initialState: EmployeeState = {
  employees: [],
};

export const employeeReducer = (state = initialState, action: EmployessActionTypes): EmployeeState => {
  switch (action.type) {
    case GET_EMPLOYESS: {
      return {
        ...state,
        employees: action.payload,
      };
    }
    default: {
      return state;
    }
  }
};
