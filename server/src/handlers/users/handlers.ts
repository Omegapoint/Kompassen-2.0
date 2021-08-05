import { Request, Response } from 'express';
import usersDB from '../../database/users';
import { httpError } from '../../lib/lib';
import { NewUser, UpdatedUser } from '../../lib/types';

type CreateUserReq = Request<null, null, NewUser>;
type UpdatedUserReq = Request<null, null, UpdatedUser>;
type GetUserReq = Request<null, null, null>;

const users = {
  async createUser({ body }: CreateUserReq, res: Response): Promise<void> {
    const { userId } = res.locals;
    try {
      const user = await usersDB.insert(body, userId);

      res.send(user);
    } catch (e) {
      httpError(res, 409, 'User already exists', e);
    }
  },

  async updateUser({ body }: UpdatedUserReq, res: Response): Promise<void> {
    const { userId } = res.locals;
    try {
      const user = await usersDB.update(body, userId);

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

  async existsByID(req: GetUserReq, res: Response): Promise<void> {
    const { userId } = res.locals;
    const user = await usersDB.getByID(userId);
    if (!user) {
      res.send({ ok: false });
      return;
    }
    res.send({ ok: true });
  },
};

export default users;
