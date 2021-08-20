import { Category, IDParam } from '../../lib/Types';
import { createListItem, deleteListItem, updateListItem } from '../lib';
import { Action } from '../types';

export type Actions = 'SET_CATEGORIES' | 'UPDATE_CATEGORY' | 'DELETE_CATEGORY' | 'CREATE_CATEGORY';

export const setCategories = (payload: Category[]): Action<Actions, Category[]> => ({
  type: 'SET_CATEGORIES',
  payload,
});

export const updateCategory = (payload: Category): Action<Actions, Category> => ({
  type: 'UPDATE_CATEGORY',
  payload,
});

export const deleteCategory = (payload: IDParam): Action<Actions, IDParam> => ({
  type: 'DELETE_CATEGORY',
  payload,
});

export const createCategory = (payload: Category): Action<Actions, Category> => ({
  type: 'CREATE_CATEGORY',
  payload,
});

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
