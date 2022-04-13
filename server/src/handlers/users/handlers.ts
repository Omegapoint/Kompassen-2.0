import { Request, Response } from 'express';
import usersDB from '../../database/users';
import { httpError } from '../../lib/lib';
import { IDParam, NewUser, UpdatedUser } from '../../lib/types';

type CreateUserReq = Request<null, null, NewUser>;
type UpdatedUserReq = Request<null, null, UpdatedUser>;
type GetUserReq = Request<null, null, null>;
type GetUserByIDReq = Request<IDParam, null, null>;

const users = {
  async createUser({ body }: CreateUserReq, res: Response): Promise<void> {
    const { userID } = res.locals;
    try {
      const user = await usersDB.insert(body, userID);

      res.send(user);
    } catch (e) {
      httpError(res, 409, 'User already exists', e);
    }
  },

  async updateUser({ body }: UpdatedUserReq, res: Response): Promise<void> {
    const { userID } = res.locals;
    try {
      const user = await usersDB.update(body, userID);

      res.send(user);
    } catch (e) {
      httpError(res, 409, 'User already exists', e);
    }
  },

  async getUser(req: GetUserReq, res: Response): Promise<void> {
    const { userID } = res.locals;
    const user = await usersDB.getByID(userID);
    if (!user) {
      httpError(res, 404, 'User not found');
      return;
    }
    res.send(user);
  },

  async getUserByID({ params }:GetUserByIDReq, res: Response) {
    const item = await usersDB.getByID(params.id);
    if (!item) {
      httpError(res, 404, 'User not found');
      return;
    }
    res.send(item);
  },

  async existsByID(req: GetUserReq, res: Response): Promise<void> {
    const { userID } = res.locals;
    const user = await usersDB.getByID(userID);
    if (!user) {
      res.send({ ok: false });
      return;
    }
    res.send({ ok: true });
  },
};

export default users;
