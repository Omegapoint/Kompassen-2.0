import { Socket } from 'socket.io';

export interface UserSession {
  socket: Socket;
  userID: string;
}

export interface Join {
  [id: string]: UserSession[];
}

export const users: UserSession[] = [];
