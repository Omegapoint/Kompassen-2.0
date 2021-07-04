import { Actions } from './actions';
import { Action } from '../types';
import { Category } from '../../lib/Types';

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
