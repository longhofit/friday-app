import { frequencyEnum, sortFieldEnunm, statusEnum, typeEnum } from '../../../constant/project';
import {
  SessionState,
  SessionActionTypes,
  SET_TOKEN,
  FILTER_SORT_PROJECT,
  FILTER_SORT_TIME_LOG,
} from './types';

const initialState: SessionState = {
  accessToken: '',

  projectFilterAndSort: {
    sort: {
      sortField: sortFieldEnunm.time,
    },
    filter: {
      status: ['ALL'],
      frequency: ['ALL'],
      type: ['ALL'],
    },
  },
  timeLogFilterAndSort: {
    sort: {
      code: false,
      time: true,
      name: false,
      status: false,
    },
    filter: {
      project: [],
      activity: [],
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

    case FILTER_SORT_TIME_LOG: {
      return {
        ...state,
        timeLogFilterAndSort: action.payload,
      };
    }

    default: {
      return state;
    }
  }
};
