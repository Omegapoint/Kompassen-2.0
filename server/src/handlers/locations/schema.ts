import Joi from 'joi';
import { NewLocation, UpdatedLocation } from '../../lib/types';
import { SHORT_STRING_LEN, STRING_MIN_LEN } from '../../lib/lib';

const defaultSchema = {
  name: Joi.string().min(STRING_MIN_LEN).max(SHORT_STRING_LEN),
};

const newLocation = Joi.object<NewLocation>({
  ...defaultSchema,
}).options({ presence: 'required' });

const updateLocation = Joi.object<UpdatedLocation>({
  id: Joi.string().uuid(),
  ...defaultSchema,
}).options({ presence: 'required' });

const locations = { newLocation, updateLocation };

export default locations;
