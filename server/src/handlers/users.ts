import { Request, Response } from 'express';
import db from '../database/database';
import { User } from '../lib/types';
import Joi from 'joi';
import { httpError } from '../lib/lib';

const newSchema = Joi.object({
  _id: Joi.string().guid(),

  createdAt: Joi.date(),
  lastLogin: Joi.date(),
  updatedAt: Joi.date(),
  updatedBy: Joi.allow(null),

  notifications: Joi.object({
    newLecture: Joi.boolean(),
    newComment: Joi.boolean(),
    adminRead: Joi.boolean(),
    lectureTaken: Joi.boolean(),
  }).options({ presence: 'required' }),
}).options({ presence: 'required' });

const newUser = (id: string) => {
  const date = new Date();
  return {
    _id: id,
    createdAt: date,
    lastLogin: date,
    updatedAt: date,
    updatedBy: date,
  };
};

const create = async ({ body }: Request<User>, res: Response): Promise<void> => {
  const { userID } = res.locals;
  const result = newSchema.validate({ ...body, ...newUser(userID) });
  const { value, error } = result;
  if (error) {
    httpError(res, 400, 'Invalid body', error);
    return;
  }

  try {
    const user = await db.users.insert(value);
    res.send(user);
  } catch (e) {
    httpError(res, 409, 'User already exists', e);
  }
};

const get = async (req: Request, res: Response): Promise<void> => {
  const { userID } = res.locals;
  const user = await db.users.getById(userID);
  if (!user) {
    httpError(res, 404, 'User not found');
    return;
  }
  res.send(user);
};

const users = {
  create,
  get,
};

export default users;
