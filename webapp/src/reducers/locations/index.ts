import { Location } from '../../lib/Types';
import { Action } from '../types';
import { Actions } from './actions';

const initial: Location[] = [];

function locations(state: Location[] = initial, action: Action<Actions, Location[]>): Location[] {
  switch (action.type) {
    case 'SET_LOCATIONS':
      return action.payload;
    default:
      return state;
  }
}

export default locations;
