import { createContext } from 'react';
import { Socket } from 'socket.io-client';

interface Context {
  socket: Socket;
}

const UserContext = createContext<Context>({} as Context);

export default UserContext;
