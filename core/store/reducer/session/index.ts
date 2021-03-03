import {
  SessionState,
  SessionActionTypes,
  SET_TOKEN,
} from './types';

const initialState: SessionState = {
  accessToken: '',
};

export const sessionReducer = (state = initialState, action: SessionActionTypes): SessionState => {
  switch (action.type) {
    case SET_TOKEN: {
      return {
        ...state,
        accessToken: action.payload,
      };
    }
    default: {
      return state;
    }
  }
};
