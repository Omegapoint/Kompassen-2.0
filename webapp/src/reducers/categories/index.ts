import { Category } from '../../lib/Types';
import { Action } from '../types';
import { Actions } from './actions';

const initial: Category[] = [];

function categories(state: Category[] = initial, action: Action<Actions, Category[]>): Category[] {
  switch (action.type) {
    case 'SET_CATEGORY':
      return action.payload;
    default:
      return state;
  }
}

export default categories;
