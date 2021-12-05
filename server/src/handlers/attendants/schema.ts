import Joi from 'joi';
import { NewAttendant } from '../../lib/types';

const defaultSchema = {
  eventID: Joi.string().uuid(),
  lectures: Joi.array().items(Joi.string().uuid()).required(),
  message: Joi.string().allow(''),
  remote: Joi.boolean(),
};

const newAttendant = Joi.object<NewAttendant>({
  ...defaultSchema,
}).options({ presence: 'required' });

const attendants = { newAttendant };

export default attendants;
