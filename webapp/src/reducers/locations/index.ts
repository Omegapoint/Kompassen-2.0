import { Actions } from './actions';
import { Action } from '../types';
import { Location } from '../../lib/Types';

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
