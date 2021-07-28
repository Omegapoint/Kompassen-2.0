import { Event } from '../../lib/Types';
import { Action } from '../types';

export type Actions = 'SET_EVENTS';

export const setEvents = (payload: Event[]): Action<Actions, Event[]> => ({
  type: 'SET_EVENTS',
  payload,
});
