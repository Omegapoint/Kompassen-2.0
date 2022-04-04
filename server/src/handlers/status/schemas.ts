import Joi from 'joi';
import { SHORT_STRING_LEN, STRING_MIN_LEN } from '../../lib/constants';
import { NewStatus, UpdatedStatus } from '../../lib/types';

const defaultSchema = {
  name: Joi.string().min(STRING_MIN_LEN).max(SHORT_STRING_LEN),
};

const newStatus = Joi.object<NewStatus>({
  ...defaultSchema,
}).options({ presence: 'required' });

const updateStatus = Joi.object<UpdatedStatus>({
  id: Joi.string().uuid(),
  ...defaultSchema,
}).options({ presence: 'required' });

const status = { newStatus, updateStatus };

export default status;
