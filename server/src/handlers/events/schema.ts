import Joi from 'joi';
import { ListEventParams, NewEvent, UpdatedEvent } from '../../lib/types';

const defaultSchema = {
  comment: Joi.string(),
  organisationID: Joi.string().uuid(),
  rooms: Joi.array().items(Joi.string()).required().unique(),
  registrationStart: Joi.date(),
  registrationEnd: Joi.date().greater(Joi.ref('registrationStart')),
  startAt: Joi.date(),
  endAt: Joi.date().greater(Joi.ref('startAt')),
};

const newEvent = Joi.object<NewEvent>({
  ...defaultSchema,
}).options({ presence: 'required' });

const updateEvent = Joi.object<UpdatedEvent>({
  id: Joi.string().uuid(),
  ...defaultSchema,
}).options({ presence: 'required' });

const filterEvents = Joi.object<ListEventParams>({
  filter: Joi.string(),
});

const events = { newEvent, updateEvent, filterEvents };

export default events;
