import { IDParam, Office } from '../../lib/Types';
import { createListItem, deleteListItem, updateListItem } from '../lib';
import { Action } from '../types';

export type Actions = 'SET_OFFICE' | 'UPDATE_OFFICE' | 'DELETE_OFFICE' | 'CREATE_OFFICE';

export const setOffice = (payload: Office[]): Action<Actions, Office[]> => ({
  type: 'SET_OFFICE',
  payload,
});

export const updateOffice = (payload: Office): Action<Actions, Office> => ({
  type: 'UPDATE_OFFICE',
  payload,
});

export const deleteOffice = (payload: IDParam): Action<Actions, IDParam> => ({
  type: 'DELETE_OFFICE',
  payload,
});

export const createOffice = (payload: Office): Action<Actions, Office> => ({
  type: 'CREATE_OFFICE',
  payload,
});

const initial: Office[] = [];

function offices(state: Office[] = initial, action: Action<Actions, never>): Office[] {
  switch (action.type) {
    case 'SET_OFFICE':
      return action.payload;
    case 'UPDATE_OFFICE':
      return updateListItem(state, action.payload);
    case 'DELETE_OFFICE':
      return deleteListItem(state, action.payload);
    case 'CREATE_OFFICE':
      return createListItem(state, action.payload);
    default:
      return state;
  }
}

export default offices;
