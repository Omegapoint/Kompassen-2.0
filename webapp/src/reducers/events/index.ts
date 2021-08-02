import { Event } from '../../lib/Types';
import { createListItem, deleteListItem, updateListItem } from '../lib';
import { Action } from '../types';
import { Actions } from './actions';

const initial: Event[] = [];

function events(state: Event[] = initial, action: Action<Actions, never>): Event[] {
  switch (action.type) {
    case 'SET_EVENTS':
      return action.payload;
    case 'UPDATE_EVENT':
      return updateListItem(state, action.payload);
    case 'DELETE_EVENT':
      return deleteListItem(state, action.payload);
    case 'CREATE_EVENT':
      return createListItem(state, action.payload);
    default:
      return state;
  }
}

export default events;
