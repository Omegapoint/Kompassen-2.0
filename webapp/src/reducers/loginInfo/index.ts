import { BrowserAuthOptions } from '@azure/msal-browser';
import { Action } from '../types';
import { Actions } from './actions';

const initial: BrowserAuthOptions = {} as BrowserAuthOptions;

function loginInfo(
  state: BrowserAuthOptions = initial,
  action: Action<Actions, BrowserAuthOptions>
): BrowserAuthOptions {
  switch (action.type) {
    case 'SET_LOGIN_INFO':
      return action.payload;
    default:
      return state;
  }
}

export default loginInfo;
