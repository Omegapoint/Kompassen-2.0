import { Event } from '../../lib/Types';
import { Action } from '../types';
import { Actions } from './actions';

const initial: Event[] = [];

function events(state: Event[] = initial, action: Action<Actions, Event[]>): Event[] {
  switch (action.type) {
    case 'SET_EVENTS':
      return action.payload;
    default:
      return state;
  }
}

export default events;
