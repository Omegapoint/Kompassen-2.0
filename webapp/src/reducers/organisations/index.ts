import { Organisation } from '../../lib/Types';
import { createListItem, deleteListItem, updateListItem } from '../lib';
import { Action } from '../types';
import { Actions } from './actions';

const initial: Organisation[] = [];

function organisations(
  state: Organisation[] = initial,
  action: Action<Actions, never>
): Organisation[] {
  switch (action.type) {
    case 'SET_ORGANISATIONS':
      return action.payload;
    case 'UPDATE_ORGANISATION':
      return updateListItem(state, action.payload);
    case 'DELETE_ORGANISATION':
      return deleteListItem(state, action.payload);
    case 'CREATE_ORGANISATION':
      return createListItem(state, action.payload);
    default:
      return state;
  }
}

export default organisations;
