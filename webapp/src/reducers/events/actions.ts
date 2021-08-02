import { Event, IDParam } from '../../lib/Types';
import { Action } from '../types';

export type Actions = 'SET_EVENTS' | 'UPDATE_EVENT' | 'DELETE_EVENT' | 'CREATE_EVENT';

export const setEvents = (payload: Event[]): Action<Actions, Event[]> => ({
  type: 'SET_EVENTS',
  payload,
});

export const updateEvent = (payload: Event): Action<Actions, Event> => ({
  type: 'UPDATE_EVENT',
  payload,
});

export const deleteEvent = (payload: IDParam): Action<Actions, IDParam> => ({
  type: 'DELETE_EVENT',
  payload,
});

export const createEvent = (payload: Event): Action<Actions, Event> => ({
  type: 'CREATE_EVENT',
  payload,
});
