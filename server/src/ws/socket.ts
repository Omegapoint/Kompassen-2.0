import { Server } from 'socket.io';
import { getClaims } from '../handlers/auth';
import { disconnectUserChat, setupChat } from './chat';
import {
  categoriesWS,
  eventsWS,
  formatsWS,
  lectureIdeasWS,
  officesWS,
  organisationsWS,
} from './defaultWS';
import { disconnectEventLectures, setupEventLectures } from './eventLectures';
import { disconnectEventRoomsLectures, setupEventLectureRooms } from './lectureRooms';
import { users } from './types';

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
    const userRole = socket.data.claims.roles ? socket.data.claims.roles[0] : 'Worker';
    users.push({ socket, userID });

    setupChat(socket, userID);
    setupEventLectures(socket, userID, userRole);
    setupEventLectureRooms(socket, userID);
    lectureIdeasWS.setup(socket);
    categoriesWS.setup(socket);
    eventsWS.setup(socket);
    organisationsWS.setup(socket);
    officesWS.setup(socket);
    formatsWS.setup(socket);

    socket.on('disconnect', () => {
      const ind = users.findIndex((e) => e.socket !== socket);
      users.splice(ind, 1);
      disconnectUserChat(userID);
      disconnectEventLectures(userID);
      disconnectEventRoomsLectures(userID);
    });
  });
};
