import { IDParam, Status } from '../../lib/Types';
import { createListItem, deleteListItem, updateListItem } from '../lib';
import { Action } from '../types';

export type Actions = 'SET_STATUSES' | 'UPDATE_STATUS' | 'DELETE_STATUS' | 'CREATE_STATUS';

export const setStatuses = (payload: Status[]): Action<Actions, Status[]> => ({
  type: 'SET_STATUSES',
  payload,
});

export const updateStatus = (payload: Status): Action<Actions, Status> => ({
  type: 'UPDATE_STATUS',
  payload,
});

export const deleteStatus = (payload: IDParam): Action<Actions, IDParam> => ({
  type: 'DELETE_STATUS',
  payload,
});

export const createStatus = (payload: Status): Action<Actions, Status> => ({
  type: 'CREATE_STATUS',
  payload,
});

const initial: Status[] = [];

function statuses(state: Status[] = initial, action: Action<Actions, never>): Status[] {
  switch (action.type) {
    case 'SET_STATUSES':
      return action.payload;
    case 'UPDATE_STATUS':
      return updateListItem(state, action.payload);
    case 'DELETE_STATUS':
      return deleteListItem(state, action.payload);
    case 'CREATE_STATUS':
      return createListItem(state, action.payload);
    default:
      return state;
  }
}

export default statuses;
