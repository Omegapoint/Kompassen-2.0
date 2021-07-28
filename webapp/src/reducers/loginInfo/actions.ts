import { BrowserAuthOptions } from '@azure/msal-browser';
import { Action } from '../types';

export type Actions = 'SET_LOGIN_INFO';

export const setLoginInfo = (payload: BrowserAuthOptions): Action<Actions, BrowserAuthOptions> => ({
  type: 'SET_LOGIN_INFO',
  payload,
});
