import { getClaims } from './handlers/auth';
import { Server, Socket } from 'socket.io';
import lectureMessagesDB from './database/lectureMessages';
import Joi from 'joi';
import { LARGE_STRING_LEN, STRING_MIN_LEN } from './lib/lib';
import { NewLectureMessage } from './lib/types';
import { logger } from './config/config';

interface Join {
  [lectureID: string]: {
    socket: Socket;
    userID: string;
  }[];
}

const joined: Join = {};

const defaultSchema = {
  message: Joi.string().min(STRING_MIN_LEN).max(LARGE_STRING_LEN),
};

const newMessage = Joi.object<NewLectureMessage>({
  ...defaultSchema,
}).options({ presence: 'required' });

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
    socket.on('lectureChat/message', async (lectureId, message) => {
      const userID = socket.data.claims.oid;

      const { error } = newMessage.validate({ message });
      if (error) {
        logger.error('invalid message');
        return;
      }
      const resp = await lectureMessagesDB.insert({ lectureId, message }, userID);
      joined[lectureId].forEach((e) => e.socket.emit(`lectureChat/${lectureId}/message`, resp));
    });

    // for a new user joining the room
    socket.on('lectureChat/join', async (lectureId) => {
      const userID = socket.data.claims.oid;
      if (!joined[lectureId]) joined[lectureId] = [];
      joined[lectureId].push({ socket, userID });
      const lm = await lectureMessagesDB.list(lectureId);
      socket.emit(`lectureChat/${lectureId}/initial`, lm);
    });

    socket.on('lectureChat/leave', (lectureId) => {
      const userID = socket.data.claims.oid;
      joined[lectureId] = (joined[lectureId] || []).filter((e1) => e1.userID !== userID);
      if (joined[lectureId].length === 0) delete joined[lectureId];
    });

    // when the user exits the room
    socket.on('disconnect', () => {
      const userID = socket.data.claims.oid;

      Object.entries(joined).forEach(([k, v]) => {
        joined[k] = v.filter((e1) => e1.userID !== userID);
      });
    });
  });
};
