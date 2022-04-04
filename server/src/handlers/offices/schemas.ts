import Joi from 'joi';
import { SHORT_STRING_LEN, STRING_MIN_LEN } from '../../lib/constants';
import { FILE_LEN, SHORT_STRING_LEN, STRING_MIN_LEN } from '../../lib/constants';
import { NewOffice, UpdatedOffice } from '../../lib/types';

const defaultSchema = {
  name: Joi.string().min(STRING_MIN_LEN).max(SHORT_STRING_LEN),
};

const newOffice = Joi.object<NewOffice>({
  ...defaultSchema,
}).options({ presence: 'required' });

const updateOffice = Joi.object<UpdatedOffice>({
  id: Joi.string().uuid(),
  ...defaultSchema,
}).options({ presence: 'required' });

const offices = { newOffice, updateOffice };

export default offices;
