import { User } from '../../lib/Types';
import { PartialAction } from '../types';

const SET_USER = 'SET_USER';

export type Actions = typeof SET_USER;

export const setUser = (payload: User): PartialAction<'SET_USER', User> => ({
  type: 'SET_USER',
  payload,
});
