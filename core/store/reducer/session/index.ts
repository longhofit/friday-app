import { frequencyEnum, statusEnum, typeEnum } from '../../../constant/project';
import {
  SessionState,
  SessionActionTypes,
  SET_TOKEN,
  FILTER_SORT_PROJECT,
} from './types';

const initialState: SessionState = {
  accessToken: '',

  projectFilterAndSort: {
    sort: {
      code: false,
      time: true,
      name: false,
      status: false,
    },
    filter: {
      status: statusEnum.ALL,
      frequency: frequencyEnum.ALL,
      type: typeEnum.ALL,
    },
  },

};

export const sessionReducer = (state = initialState, action: SessionActionTypes): SessionState => {
  switch (action.type) {

    case SET_TOKEN: {
      return {
        ...state,
        accessToken: action.payload,
      };
    }

    case FILTER_SORT_PROJECT: {
      return {
        ...state,
        projectFilterAndSort: action.payload,
      };
    }

    default: {
      return state;
    }
  }
};
