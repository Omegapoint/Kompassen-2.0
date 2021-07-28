import { Category } from '../../lib/Types';
import { Action } from '../types';

export type Actions = 'SET_CATEGORY';

export const setCategories = (payload: Category[]): Action<Actions, Category[]> => ({
  type: 'SET_CATEGORY',
  payload,
});
