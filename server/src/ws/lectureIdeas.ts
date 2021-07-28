import { Socket } from 'socket.io';
import lecturesDB from '../database/lecture';
import { Lecture } from '../lib/types';
import { users } from './types';

export const onUpdatedLectureIdea = (lecture: Lecture): void => {
  users.forEach((user) => {
    user.socket.emit('lectureIdeas/update', lecture);
  });
};

export const onCreatedLectureIdea = (lecture: Lecture): void => {
  users.forEach((user) => {
    user.socket.emit('lectureIdeas/create', lecture);
  });
};

export const onDeleteLectureIdea = (id: string): void => {
  users.forEach((user) => {
    user.socket.emit('lectureIdeas/delete', id);
  });
};

export const setupLectureIdeas = (socket: Socket): void => {
  socket.on('lectureIdeas', async () => {
    const resp = await lecturesDB.list(true);
    socket.emit('lectureIdeas', resp);
  });
};
