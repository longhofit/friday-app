export interface FilterAndSortProjectForm {
  sort: {
    name: boolean,
    time: boolean,
    status: boolean,
    code: boolean,
  },
  filter: {
    status: string[],
    type:  string[],
    frequency:  string[],
  },
}

export interface FilterAndSortTimeLogForm {
  sort: {
    name: boolean,
    time: boolean,
    status: boolean,
    code: boolean,
  },
  filter: {
    project: [],
    activity: [],
  },
}

export interface SessionState {
  accessToken: string;
  projectFilterAndSort: FilterAndSortProjectForm;
  timeLogFilterAndSort: FilterAndSortTimeLogForm;
}

export const SET_TOKEN = 'SET_TOKEN';
export const FILTER_SORT_PROJECT = 'FILTER_SORT_PROJECT';
export const FILTER_SORT_TIME_LOG = 'FILTER_SORT_TIME_LOG';

export interface SetTokenAction {
  type: typeof SET_TOKEN;
  payload: string;
}

export interface FilterAndSortProjectAction {
  type: typeof FILTER_SORT_PROJECT;
  payload: FilterAndSortProjectForm;
}

export interface FilterAndSortTimeLogAction {
  type: typeof FILTER_SORT_TIME_LOG;
  payload: FilterAndSortTimeLogForm;
}


export type SessionActionTypes = SetTokenAction | FilterAndSortProjectAction | FilterAndSortTimeLogAction;
