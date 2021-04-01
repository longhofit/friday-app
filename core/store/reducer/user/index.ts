import {
  UserState,
  UserActionTypes,
  SET_USER,
  SET_ROLE
} from './types';

const initialState: UserState = {
  email: '',
  role: '',
  annualDaysUsed: 0,
  dateOfBirth: '',
  id: '',
  name: '',
  phoneNumber: '',
  slackId: '',
};

export const userReducer = (state = initialState, action: UserActionTypes): UserState => {
  switch (action.type) {
    case SET_USER: {

      return action.payload;
    }

    case SET_ROLE: {
      return {
        ...state,
        role: action.payload,
      };
    }

    default: {
      return state;
    }
  }
};
