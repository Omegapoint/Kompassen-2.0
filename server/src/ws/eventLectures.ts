import { Socket } from 'socket.io';
import lecturesDB from '../database/lecture';
import { Lecture } from '../lib/types';
import { Join } from './types';

const joined: Join = {};

export const setupEventLectures = (socket: Socket, userID: string, userRole: string): void => {
  socket.on('event/lecture/join', async (eventID) => {
    if (!joined[eventID]) joined[eventID] = [];
    joined[eventID].push({ socket, userID });
    const eventLectures = await lecturesDB.listEventLectures(eventID);
    const newEventLectures =
      userRole !== 'Admin'
        ? eventLectures.map((item) => ({ ...item, message: null }))
        : eventLectures;
    socket.emit(`event/${eventID}/lecture`, newEventLectures);
  });

  socket.on('event/lecture/leave', (eventID) => {
    joined[eventID] = (joined[eventID] || []).filter((e1) => e1.userID !== userID);
    if (joined[eventID].length === 0) delete joined[eventID];
  });
};

export const onEventLectureCreate = (lecture: Lecture): void => {
  if (lecture.eventID) {
    joined[lecture.eventID]?.forEach((e) =>
      e.socket.emit(`event/${lecture.eventID}/lecture/create`, lecture)
    );
  }
};

export const onEventLectureUpdate = (lecture: Lecture): void => {
  if (lecture.eventID) {
    joined[lecture.eventID]?.forEach((e) =>
      e.socket.emit(`event/${lecture.eventID}/lecture/update`, lecture)
    );
  }
};

export const onEventLectureDelete = (lecture: Lecture): void => {
  if (lecture.eventID) {
    joined[lecture.eventID]?.forEach((e) =>
      e.socket.emit(`event/${lecture.eventID}/lecture/delete`, lecture)
    );
  }
};

export const disconnectEventLectures = (userID: string): void => {
  Object.entries(joined).forEach(([k, v]) => {
    joined[k] = v.filter((e1) => e1.userID !== userID);
  });
};
