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
    filter: {
      project: ['ALL'],
      activity: ['ALL'],
    },
    menuFilter:{
      project: [{label: 'All', value: 'ALL'}],
      activity: [{label: 'All', value: 'ALL'}],
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
