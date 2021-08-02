import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';
import { httpError } from '../lib/lib';
import { UpdatedEvent } from '../lib/types';
import categories from './categories/schema';
import events from './events/schema';
import lectures from './lectures/schema';
import locations from './locations/schema';
import organisations from './organisations/schema';
import users from './users/schema';

type KeyType = 'body' | 'params' | 'query';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function validate(schema: Joi.ObjectSchema, key: KeyType = 'body'): any {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.validate(req[key]);

    const { error } = result;
    if (error) {
      httpError(res, 400, 'Invalid body', error);
    } else {
      next();
    }
  };
}

const uuidParam = Joi.object<UpdatedEvent>({
  id: Joi.string().uuid(),
}).options({ presence: 'required' });

const schema = {
  organisations,
  events,
  users,
  locations,
  categories,
  lectures,
  uuidParam,
};

export default schema;
