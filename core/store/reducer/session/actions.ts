import {
  SET_TOKEN,
  SetTokenAction,
  FILTER_SORT_PROJECT,
  FilterAndSortProjectForm,
  FilterAndSortProjectAction,
  FILTER_SORT_TIME_LOG,
  FilterAndSortTimeLogForm,
  FilterAndSortTimeLogAction,
} from './types';

export const onSetToken = (payload: string): SetTokenAction => ({
  type: SET_TOKEN,
  payload,
});

export const onFilterSortProject = (payload: FilterAndSortProjectForm): FilterAndSortProjectAction => ({
  type: FILTER_SORT_PROJECT,
  payload,
});

export const onFilterSortTimeLog = (payload: FilterAndSortTimeLogForm): FilterAndSortTimeLogAction => ({
  type: FILTER_SORT_TIME_LOG,
  payload,
});
