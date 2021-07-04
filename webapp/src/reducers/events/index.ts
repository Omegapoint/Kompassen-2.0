import { Actions } from './actions';
import { Action } from '../types';
import { Event } from '../../lib/Types';

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
