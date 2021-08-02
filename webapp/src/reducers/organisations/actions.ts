import { IDParam, Organisation } from '../../lib/Types';
import { Action } from '../types';

export type Actions =
  | 'SET_ORGANISATIONS'
  | 'UPDATE_ORGANISATION'
  | 'DELETE_ORGANISATION'
  | 'CREATE_ORGANISATION';

export const setOrganisations = (payload: Organisation[]): Action<Actions, Organisation[]> => ({
  type: 'SET_ORGANISATIONS',
  payload,
});

export const updateOrganisation = (payload: Organisation): Action<Actions, Organisation> => ({
  type: 'UPDATE_ORGANISATION',
  payload,
});

export const deleteOrganisation = (payload: IDParam): Action<Actions, IDParam> => ({
  type: 'DELETE_ORGANISATION',
  payload,
});

export const createOrganisation = (payload: Organisation): Action<Actions, Organisation> => ({
  type: 'CREATE_ORGANISATION',
  payload,
});
