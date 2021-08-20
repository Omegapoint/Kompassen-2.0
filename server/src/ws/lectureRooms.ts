import { Socket } from 'socket.io';
import lectureRoomsDB from '../database/lectureRooms';
import { IDParam, LectureRoom } from '../lib/types';
import { Join } from './types';

const joined: Join = {};

export const setupEventLectureRooms = (socket: Socket, userID: string): void => {
  socket.on('event/lecture/room/join', async (eventID) => {
    if (!joined[eventID]) joined[eventID] = [];
    joined[eventID].push({ socket, userID });
    const lm = await lectureRoomsDB.list(eventID);
    socket.emit(`event/${eventID}/room/lecture`, lm);
  });

  socket.on('event/lecture/room/leave', (eventID) => {
    joined[eventID] = (joined[eventID] || []).filter((e1) => e1.userID !== userID);
    if (joined[eventID].length === 0) delete joined[eventID];
  });
};

export const onEventLectureRoomCreate = (lectureRoom: LectureRoom, eventID: string): void => {
  if (eventID) {
    joined[eventID]?.forEach((e) =>
      e.socket.emit(`event/${eventID}/lecture/room/create`, lectureRoom)
    );
  }
};

export const onEventLectureRoomUpdate = (lectureRoom: LectureRoom, eventID: string): void => {
  if (eventID) {
    joined[eventID]?.forEach((e) =>
      e.socket.emit(`event/${eventID}/lecture/room/update`, lectureRoom)
    );
  }
};

export const onEventLectureRoomDelete = (id: IDParam, eventID: string): void => {
  if (eventID) {
    joined[eventID]?.forEach((e) => e.socket.emit(`event/${eventID}/lecture/room/delete`, id));
  }
};

export const onEventRoomDelete = (id: IDParam, eventID: string): void => {
  if (eventID) {
    joined[eventID]?.forEach((e) => e.socket.emit(`event/${eventID}/room/delete`, id));
  }
};

export const disconnectEventRoomsLectures = (userID: string): void => {
  Object.entries(joined).forEach(([k, v]) => {
    joined[k] = v.filter((e1) => e1.userID !== userID);
  });
};
