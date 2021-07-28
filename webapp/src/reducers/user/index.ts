import { User } from '../../lib/Types';
import { PartialAction } from '../types';
import { Actions } from './actions';

const initial = {} as User;

function user(state: User = initial, action: PartialAction<Actions, User>): User {
  switch (action.type) {
    case 'SET_USER':
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
}

export default user;
