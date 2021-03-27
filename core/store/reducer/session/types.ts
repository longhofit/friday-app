export interface FilterAndSortProjectForm {
  sort: {
    name: boolean,
    time: boolean,
    status: boolean,
    code: boolean,
  },
  filter: {
    status: string,
    type: string,
    frequency: string,
  },
}

export interface SessionState {
  accessToken: string;
  projectFilterAndSort: FilterAndSortProjectForm;
}

export const SET_TOKEN = 'SET_TOKEN';
export const FILTER_SORT_PROJECT = 'FILTER_SORT_PROJECT';

export interface SetTokenAction {
  type: typeof SET_TOKEN;
  payload: string;
}

export interface FilterAndSortProjectAction {
  type: typeof FILTER_SORT_PROJECT;
  payload: FilterAndSortProjectForm;
}


export type SessionActionTypes = SetTokenAction | FilterAndSortProjectAction;
