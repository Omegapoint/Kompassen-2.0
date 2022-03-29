import { Format, IDParam } from '../../lib/Types';
import { createListItem, deleteListItem, updateListItem } from '../lib';
import { Action } from '../types';

export type Actions = 'SET_FORMATS' | 'UPDATE_FORMAT' | 'DELETE_FORMAT' | 'CREATE_FORMAT';

export const setFormats = (payload: Format[]): Action<Actions, Format[]> => ({
  type: 'SET_FORMATS',
  payload,
});

export const updateFormat = (payload: Format): Action<Actions, Format> => ({
  type: 'UPDATE_FORMAT',
  payload,
});

export const deleteFormat = (payload: IDParam): Action<Actions, IDParam> => ({
  type: 'DELETE_FORMAT',
  payload,
});

export const createFormat = (payload: Format): Action<Actions, Format> => ({
  type: 'CREATE_FORMAT',
  payload,
});

const initial: Format[] = [];

function formats(state: Format[] = initial, action: Action<Actions, never>): Format[] {
  switch (action.type) {
    case 'SET_FORMATS':
      return action.payload;
    case 'UPDATE_FORMAT':
      return updateListItem(state, action.payload);
    case 'DELETE_FORMAT':
      return deleteListItem(state, action.payload);
    case 'CREATE_FORMAT':
      return createListItem(state, action.payload);
    default:
      return state;
  }
}

export default formats;
