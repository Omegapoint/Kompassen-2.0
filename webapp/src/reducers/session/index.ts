import { PartialAction } from '../types';
import { Actions, SessionState } from './actions';

const initial = {} as SessionState;

function session(
  state: SessionState = initial,
  action: PartialAction<Actions, SessionState>
): SessionState {
  switch (action.type) {
    case 'SET_SOCKET':
    case 'SET_API_TOKEN':
    case 'SET_AZURE_USER':
    case 'SET_GRAPH_TOKEN':
    case 'SET_ROLE':
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
}

export default session;
