import { getClaims } from '../handlers/auth';
import { Server } from 'socket.io';
import { setupChat, disconnectUserChat } from './chat';
import { users } from './types';
import { setupLectureIdeas } from './lectureIdeas';

export const setupWebSocket = (io: Server): void => {
  io.use(async (socket, next) => {
    if (socket.handshake.auth.token) {
      const claims = await getClaims(socket.handshake.auth.token);
      if (claims === null) {
        next(new Error('Authentication error'));
      } else {
        // eslint-disable-next-line no-param-reassign
        socket.data.claims = claims;
        next();
      }
    } else {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    const userID = socket.data.claims.oid;
    users.push({ socket, userID });

    setupChat(socket, userID);
    setupLectureIdeas(socket);

    socket.on('disconnect', () => {
      const ind = users.findIndex((e) => e.socket !== socket);
      users.splice(ind, 1);
      disconnectUserChat(userID);
    });
  });
};
