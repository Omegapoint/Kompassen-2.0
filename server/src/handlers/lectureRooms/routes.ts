import { Express } from 'express';
import { admin } from '../auth';
import schema, { validate } from '../validationSchemas';
import lectureRooms from './handlers';

const lectureRoomsRoutes = (app: Express): void => {
  app.post(
    '/event/room/lecture',
    admin,
    validate(schema.lectureRooms.newLectureRoom),
    lectureRooms.create
  );
  app.put(
    '/event/room/lecture',
    admin,
    validate(schema.lectureRooms.updateLectureRoom),
    lectureRooms.update
  );
  app.delete(
    '/event/room/lecture/:id',
    admin,
    validate(schema.uuidParam, 'params'),
    lectureRooms.delete
  );
  app.get(
    '/event/room/lecture/:id',
    admin,
    validate(schema.uuidParam, 'params'),
    lectureRooms.getByID
  );
  app.get(
    '/event/:id/room/lecture',
    admin,
    validate(schema.uuidParam, 'params'),
    lectureRooms.list
  );
};

export default lectureRoomsRoutes;
