import { Request, Response } from 'express';
import attendantsDB from '../../database/attendants';
import { httpError } from '../../lib/lib';
import { IDParam, NewAttendant } from '../../lib/types';

interface Handlers {
  create: (req: Request<null, null, NewAttendant>, res: Response) => Promise<void>;
  getAttendanceByEventID: (req: Request<IDParam, null, null>, res: Response) => Promise<void>;
  isAttending: (req: Request<IDParam, null, null>, res: Response) => Promise<void>;
  delete: (req: Request<IDParam, null, null>, res: Response) => Promise<void>;
}

const attendants: Handlers = {
  async create({ body }, res) {
    const { userID } = res.locals;
    try {
      const item = await attendantsDB.insert(body, userID);
      res.send(item);
    } catch (e: Error | unknown) {
      if (e instanceof Error) httpError(res, 409, e.message);
    }
  },
  async getAttendanceByEventID({ params }, res) {
    const item = await attendantsDB.getAttendanceByEventID(params.id);
    if (!item) {
      httpError(res, 404, 'Attendant not found');
      return;
    }
    res.send(item);
  },
  async isAttending({ params }, res) {
    const { userID } = res.locals;
    const item = await attendantsDB.isAttending(params.id, userID);
    res.send({ ok: item });
  },
  async delete({ params }, res) {
    const { userID } = res.locals;
    const deleted = await attendantsDB.delete(params.id, userID);
    if (!deleted) {
      httpError(res, 404, 'Attendant not found');
      return;
    }
    res.send(deleted);
  },
};

export default attendants;
