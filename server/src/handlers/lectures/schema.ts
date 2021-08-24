import Joi from 'joi';
import { LARGE_STRING_LEN, SHORT_STRING_LEN, STRING_MIN_LEN } from '../../lib/constants';
import { ListLecturesParams, NewLecture, NewLectureIdea, UpdatedLecture } from '../../lib/types';

const defaultSchema = {
  title: Joi.string().min(STRING_MIN_LEN).max(SHORT_STRING_LEN).required(),
  description: Joi.string().min(STRING_MIN_LEN).max(LARGE_STRING_LEN).required(),
  lecturer: Joi.string().allow(null),
  tags: Joi.array().items(Joi.string().required()).required(),
};

const other = {
  eventID: Joi.string().uuid(),
  duration: Joi.number().max(1000),
  categoryID: Joi.string().uuid(),
  maxParticipants: Joi.number().min(0).max(1000),
  locationID: Joi.string().min(STRING_MIN_LEN).max(SHORT_STRING_LEN).required(),
  remote: Joi.boolean(),
  requirements: Joi.string().min(STRING_MIN_LEN).max(LARGE_STRING_LEN),
  preparations: Joi.string().min(STRING_MIN_LEN).max(LARGE_STRING_LEN),
  message: Joi.string().min(STRING_MIN_LEN).max(LARGE_STRING_LEN),
  draft: Joi.boolean(),
};

const newIdea = Joi.object<NewLectureIdea>({
  ...defaultSchema,
});

const newLecture = Joi.object<NewLecture>({
  ...defaultSchema,
  ...other,
}).options({ presence: 'required' });

const updateLecture = Joi.object<UpdatedLecture>({
  id: Joi.string().uuid(),
  ...defaultSchema,
  ...other,
}).options({ presence: 'required' });

const listLectures = Joi.object<ListLecturesParams>({
  mine: Joi.string().valid('true', 'false'),
});

const lectures = { newLecture, updateLecture, newIdea, listLectures };

export default lectures;
