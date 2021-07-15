import { Actions, SessionState } from './actions';
import { PartialAction } from '../types';

const initial = {} as SessionState;

function session(
  state: SessionState = initial,
  action: PartialAction<Actions, SessionState>
): SessionState {
  switch (action.type) {
    case 'SET_SOCKET':
    case 'SET_TOKEN':
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
}

export default session;