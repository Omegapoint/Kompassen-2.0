import { IDParam, Location } from '../../lib/Types';
import { Action } from '../types';

export type Actions = 'SET_LOCATIONS' | 'UPDATE_LOCATION' | 'DELETE_LOCATION' | 'CREATE_LOCATION';

export const setLocations = (payload: Location[]): Action<Actions, Location[]> => ({
  type: 'SET_LOCATIONS',
  payload,
});

export const updateLocation = (payload: Location): Action<Actions, Location> => ({
  type: 'UPDATE_LOCATION',
  payload,
});

export const deleteLocation = (payload: IDParam): Action<Actions, IDParam> => ({
  type: 'DELETE_LOCATION',
  payload,
});

export const createLocation = (payload: Location): Action<Actions, Location> => ({
  type: 'CREATE_LOCATION',
  payload,
});
