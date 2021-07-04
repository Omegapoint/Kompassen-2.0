import { Action } from '../types';
import { Category } from '../../lib/Types';

export type Actions = 'SET_CATEGORY';

export const setCategories = (payload: Category[]): Action<Actions, Category[]> => ({
  type: 'SET_CATEGORY',
  payload,
});
