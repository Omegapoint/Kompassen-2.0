import Joi from 'joi';
import { SHORT_STRING_LEN, STRING_MIN_LEN } from '../../lib/constants';
import { NewOrganisation, UpdatedOrganisation } from '../../lib/types';

const defaultSchema = {
  name: Joi.string().min(STRING_MIN_LEN).max(SHORT_STRING_LEN),
};

const newOrganisation = Joi.object<NewOrganisation>({
  ...defaultSchema,
}).options({ presence: 'required' });

const updateOrganisation = Joi.object<UpdatedOrganisation>({
  id: Joi.string().uuid(),
  ...defaultSchema,
}).options({ presence: 'required' });

const organisations = { newOrganisation, updateOrganisation };

export default organisations;
