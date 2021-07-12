import { createContext } from 'react';
import { Socket } from 'socket.io-client';
import { User } from './lib/Types';

interface Context {
  user: User;
  socket: Socket;
}

const UserContext = createContext<Context>({} as Context);

export default UserContext;
