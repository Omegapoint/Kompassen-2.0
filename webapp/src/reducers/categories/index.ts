import { Category } from '../../lib/Types';
import { createListItem, deleteListItem, updateListItem } from '../lib';
import { Action } from '../types';
import { Actions } from './actions';

const initial: Category[] = [];

function categories(state: Category[] = initial, action: Action<Actions, never>): Category[] {
  switch (action.type) {
    case 'SET_CATEGORIES':
      return action.payload;
    case 'UPDATE_CATEGORY':
      return updateListItem(state, action.payload);
    case 'DELETE_CATEGORY':
      return deleteListItem(state, action.payload);
    case 'CREATE_CATEGORY':
      return createListItem(state, action.payload);
    default:
      return state;
  }
}

export default categories;
