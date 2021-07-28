import { Location } from '../../lib/Types';
import { Action } from '../types';

export type Actions = 'SET_LOCATIONS';

export const setLocations = (payload: Location[]): Action<Actions, Location[]> => ({
  type: 'SET_LOCATIONS',
  payload,
});
