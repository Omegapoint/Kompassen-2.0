import Joi from 'joi';
import { SHORT_STRING_LEN, STRING_MIN_LEN } from '../../lib/constants';
import { NewFormat, UpdatedFormat } from '../../lib/types';

const defaultSchema = {
  name: Joi.string().min(STRING_MIN_LEN).max(SHORT_STRING_LEN),
  info: Joi.string().min(STRING_MIN_LEN).max(SHORT_STRING_LEN).allow(null),
};

const newFormat = Joi.object<NewFormat>({
  ...defaultSchema,
}).options({ presence: 'required' });

const updateFormat = Joi.object<UpdatedFormat>({
  id: Joi.string().uuid(),
  ...defaultSchema,
}).options({ presence: 'required' });

const formats = { newFormat, updateFormat };

export default formats;
