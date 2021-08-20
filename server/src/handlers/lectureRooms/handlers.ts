import { Request, Response } from 'express';
import lecturesDB from '../../database/lecture';
import lectureRoomsDB from '../../database/lectureRooms';
import { httpError } from '../../lib/lib';
import { IDParam, LectureRoom, NewLectureRoom, UpdatedLectureRoom } from '../../lib/types';
import {
  onEventLectureRoomCreate,
  onEventLectureRoomDelete,
  onEventLectureRoomUpdate,
} from '../../ws/lectureRooms';

interface Handlers {
  getByID: (req: Request<IDParam, null, null>, res: Response) => Promise<void>;
  list: (req: Request<IDParam, null, null>, res: Response) => Promise<void>;
  create: (req: Request<null, null, NewLectureRoom>, res: Response) => Promise<void>;
  update: (req: Request<null, null, UpdatedLectureRoom>, res: Response) => Promise<void>;
  delete: (req: Request<IDParam, null, null>, res: Response) => Promise<void>;
}

const lectureRooms: Handlers = {
  async getByID({ params }, res) {
    const item = await lectureRoomsDB.getByID(params.id);
    if (!item) {
      httpError(res, 404, 'LectureRoom not found');
      return;
    }
    res.send(item);
  },
  async list({ params }, res) {
    const items = await lectureRoomsDB.list(params.id);
    res.send(items);
  },
  async create({ body }, res) {
    const item = await lectureRoomsDB.insert(body);
    const lectureRoom = await lectureRoomsDB.getByID(item.id);
    onEventLectureRoomCreate(lectureRoom as LectureRoom, body.eventID);
    res.send(item);
  },
  async update({ body }, res) {
    const item = await lectureRoomsDB.update(body);
    const lectureRoom = await lectureRoomsDB.getByID(item.id);
    onEventLectureRoomUpdate(lectureRoom as LectureRoom, body.eventID);
    res.send(item);
  },
  async delete({ params }, res) {
    const item1 = await lectureRoomsDB.getByID(params.id);
    const item2 = await lecturesDB.getByID(item1?.lectureID as string);

    const item = await lectureRoomsDB.delete(params.id);
    if (!item) {
      httpError(res, 404, 'Lecture not found');
      return;
    }
    onEventLectureRoomDelete(params, item2?.eventID as string);
    res.send(item);
  },
};

export default lectureRooms;
