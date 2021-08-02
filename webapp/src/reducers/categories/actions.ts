import { Category, IDParam } from '../../lib/Types';
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
