import {
  UserState,
  UserActionTypes,
  SET_USER,
  SET_ROLE
} from './types';

const initialState: UserState = {
  name: '',
  email: '',
  sub: '',
  role: '',
};

export const userReducer = (state = initialState, action: UserActionTypes): UserState => {
  switch (action.type) {
    case SET_USER: {
      const user: UserState = {
        role: state.role,
        name: action.payload.name,
        email: action.payload.email,
        sub: action.payload.sub,
      };

      return user;
    }

    case SET_ROLE: {
      console.log('paaa', {
        ...state,
        role: action.payload,
      });
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
