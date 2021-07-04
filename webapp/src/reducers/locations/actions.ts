import { Action } from '../types';
import { Location } from '../../lib/Types';

export type Actions = 'SET_LOCATIONS';

export const setLocations = (payload: Location[]): Action<Actions, Location[]> => ({
  type: 'SET_LOCATIONS',
  payload,
});
