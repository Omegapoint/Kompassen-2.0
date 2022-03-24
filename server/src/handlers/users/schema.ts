import Joi from 'joi';
import { NewUser, Notifications, UpdatedUser } from '../../lib/types';

const defaultSchema = {
  speakerBio: Joi.string().allow(null),
  officeId: Joi.string().uuid().allow(null),
  notifications: Joi.object<Notifications>({
    newLecture: Joi.boolean(),
    newComment: Joi.boolean(),
    adminRead: Joi.boolean(),
    lectureTaken: Joi.boolean(),
  }).options({ presence: 'required' }),
};

const newUser = Joi.object<NewUser>({
  ...defaultSchema,
}).options({ presence: 'required' });

const updateUser = Joi.object<UpdatedUser>({
  ...defaultSchema,
  id: Joi.string().uuid(),
}).options({ presence: 'required' });

const users = {
  newUser,
  updateUser,
};

export default users;
