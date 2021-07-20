import Joi from 'joi';
import { NewCategory, UpdatedCategory } from '../../lib/types';
import { FILE_LEN, SHORT_STRING_LEN, STRING_MIN_LEN } from '../../lib/constants';

const defaultSchema = {
  name: Joi.string().min(STRING_MIN_LEN).max(SHORT_STRING_LEN),
  icon: Joi.string().max(FILE_LEN),
};

const newCategory = Joi.object<NewCategory>({
  ...defaultSchema,
}).options({ presence: 'required' });

const updateCategory = Joi.object<UpdatedCategory>({
  id: Joi.string().uuid(),
  ...defaultSchema,
}).options({ presence: 'required' });

const categories = { newCategory, updateCategory };

export default categories;
