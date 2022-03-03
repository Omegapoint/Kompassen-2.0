import Joi from 'joi';
import { LARGE_STRING_LEN, SHORT_STRING_LEN, STRING_MIN_LEN } from '../../lib/constants';
import {
  Approved,
  ListLecturesParams,
  NewLecture,
  NewLectureIdea,
  UpdatedLecture,
  UpdatedLectureIdea,
} from '../../lib/types';

const defaultSchema = {
  title: Joi.string().min(STRING_MIN_LEN).max(SHORT_STRING_LEN).required(),
  description: Joi.string().min(STRING_MIN_LEN).max(LARGE_STRING_LEN).required(),
  lecturer: Joi.string().allow(null),
  tags: Joi.array().items(Joi.string()).required(),
};

const other = {
  eventID: Joi.string().uuid().required(),
  duration: Joi.number()
    .max(1000 * 60)
    .required(),
  categoryID: Joi.string().uuid().required(),
  maxParticipants: Joi.number().min(0).max(1000).allow(null),
  remote: Joi.string().required(),
  requirements: Joi.string().min(STRING_MIN_LEN).max(LARGE_STRING_LEN).allow(null),
  preparations: Joi.string().min(STRING_MIN_LEN).max(LARGE_STRING_LEN).allow(null),
  message: Joi.string().min(STRING_MIN_LEN).max(LARGE_STRING_LEN).allow(null),
  draft: Joi.boolean(),
};

const approve = Joi.object<Approved>({
  id: Joi.string().uuid(),
  approved: Joi.boolean(),
}).options({ presence: 'required' });

const newIdea = Joi.object<NewLectureIdea>({
  ...defaultSchema,
});

const updatedIdea = Joi.object<UpdatedLectureIdea>({
  id: Joi.string().uuid(),
  ...defaultSchema,
});

const newLecture = Joi.object<NewLecture>({
  ...defaultSchema,
  ...other,
});

const updateLecture = Joi.object<UpdatedLecture>({
  id: Joi.string().uuid(),
  ...defaultSchema,
  ...other,
});

const listLectures = Joi.object<ListLecturesParams>({
  mine: Joi.string().valid('true', 'false'),
});

const lectures = { newLecture, updateLecture, newIdea, listLectures, approve, updatedIdea };

export default lectures;
