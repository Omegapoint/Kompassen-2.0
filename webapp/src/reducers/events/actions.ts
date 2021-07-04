import { Action } from '../types';
import { Event } from '../../lib/Types';

export type Actions = 'SET_EVENTS';

export const setEvents = (payload: Event[]): Action<Actions, Event[]> => ({
  type: 'SET_EVENTS',
  payload,
});
