import Joi from 'joi';
import { Socket } from 'socket.io';
import { logger } from '../config/config';
import lectureMessagesDB from '../database/lectureMessages';
import { LARGE_STRING_LEN, STRING_MIN_LEN } from '../lib/constants';
import { NewLectureMessage, UpdatedLectureMessage } from '../lib/types';
import { Join } from './types';

const joined: Join = {};

const defaultSchema = {
  message: Joi.string().min(STRING_MIN_LEN).max(LARGE_STRING_LEN),
};

const newMessage = Joi.object<NewLectureMessage>({
  ...defaultSchema,
}).options({ presence: 'required' });

const updatedMessage = Joi.object<UpdatedLectureMessage>({
  ...defaultSchema,
}).options({ presence: 'required' });

export const setupChat = (socket: Socket, userID: string): void => {
  socket.on('lectureChat/message', async (lectureID, message) => {
    const { error } = newMessage.validate({ message });
    if (error) {
      logger.error('invalid message');
      return;
    }
    const resp = await lectureMessagesDB.insert({ lectureID, message }, userID);
    joined[lectureID]?.forEach((e) => e.socket.emit(`lectureChat/${lectureID}/message`, resp));
  });

  socket.on('lectureChat/message/update', async (msg: UpdatedLectureMessage) => {
    const { message } = msg;
    const { error } = updatedMessage.validate({ message });
    if (error) {
      logger.error('invalid message');
      return;
    }
    await lectureMessagesDB.update(msg);
  });

  // for a new user joining the room
  socket.on('lectureChat/join', async (lectureId) => {
    if (!joined[lectureId]) joined[lectureId] = [];
    joined[lectureId]?.push({ socket, userID });
    const lm = await lectureMessagesDB.list(lectureId);
    socket.emit(`lectureChat/${lectureId}/initial`, lm);
  });

  socket.on('lectureChat/leave', (lectureId) => {
    joined[lectureId] = (joined[lectureId] || []).filter((e1) => e1.userID !== userID);
    if (joined[lectureId].length === 0) delete joined[lectureId];
  });
};

export const disconnectUserChat = (userID: string): void => {
  Object.entries(joined).forEach(([k, v]) => {
    joined[k] = v.filter((e1) => e1.userID !== userID);
  });
};
