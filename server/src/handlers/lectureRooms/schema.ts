import Joi from 'joi';
import { NewLectureRoom, UpdatedLectureRoom } from '../../lib/types';

const defaultSchema = {
  lectureID: Joi.string().uuid(),
  eventID: Joi.string().uuid(),
  roomID: Joi.string().uuid(),
  startAt: Joi.date(),
};

const newLectureRoom = Joi.object<NewLectureRoom>({
  ...defaultSchema,
}).options({ presence: 'required' });

const updateLectureRoom = Joi.object<UpdatedLectureRoom>({
  id: Joi.string().uuid(),
  ...defaultSchema,
}).options({ presence: 'required' });

const lectureRooms = { newLectureRoom, updateLectureRoom };

export default lectureRooms;
