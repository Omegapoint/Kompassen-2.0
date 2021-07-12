import { Request, Response } from 'express';
import { httpError } from '../../lib/lib';
import { NewUser, UpdatedUser } from '../../lib/types';
import usersDB from '../../database/users';

type CreateUserReq = Request<null, null, NewUser>;
type UpdatedUserReq = Request<null, null, UpdatedUser>;
type GetUserReq = Request<null, null, null>;

const users = {
  async createUser({ body }: CreateUserReq, res: Response): Promise<void> {
    const { userId, name } = res.locals;
    try {
      const user = await usersDB.insert(body, userId, name);

      res.send(user);
    } catch (e) {
      httpError(res, 409, 'User already exists', e);
    }
  },

  async updateUser({ body }: UpdatedUserReq, res: Response): Promise<void> {
    const { userId, name } = res.locals;
    try {
      const user = await usersDB.update(body, userId, name);

      res.send(user);
    } catch (e) {
      httpError(res, 409, 'User already exists', e);
    }
  },

  async getUser(req: GetUserReq, res: Response): Promise<void> {
    const { userId } = res.locals;
    const user = await usersDB.getByID(userId);
    if (!user) {
      httpError(res, 404, 'User not found');
      return;
    }
    res.send(user);
  },
};

export default users;
