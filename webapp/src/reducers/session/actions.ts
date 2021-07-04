import { Socket } from 'socket.io-client';
import { PartialAction } from '../types';

export type Actions = 'SET_SOCKET' | 'SET_TOKEN';

export interface SessionState {
  socket: Socket;
  token: string;
}

export const setSocket = (socket: Socket): PartialAction<Actions, SessionState> => ({
  type: 'SET_SOCKET',
  payload: { socket },
});

export const setToken = (token: string): PartialAction<Actions, SessionState> => ({
  type: 'SET_TOKEN',
  payload: { token },
});
