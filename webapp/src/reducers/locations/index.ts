import { Location } from '../../lib/Types';
import { createListItem, deleteListItem, updateListItem } from '../lib';
import { Action } from '../types';
import { Actions } from './actions';

const initial: Location[] = [];

function locations(state: Location[] = initial, action: Action<Actions, never>): Location[] {
  switch (action.type) {
    case 'SET_LOCATIONS':
      return action.payload;
    case 'UPDATE_LOCATION':
      return updateListItem(state, action.payload);
    case 'DELETE_LOCATION':
      return deleteListItem(state, action.payload);
    case 'CREATE_LOCATION':
      return createListItem(state, action.payload);
    default:
      return state;
  }
}

export default locations;
