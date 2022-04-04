import { Request, Response } from 'express';
import statusDb from '../../database/status';
import { httpError } from '../../lib/lib';
import { IDParam, NewStatus } from '../../lib/types';

interface Handlers {
  create: (req: Request<null, null, NewStatus>, res: Response) => Promise<void>;
  getByID: (req: Request<IDParam, null, null>, res: Response) => Promise<void>;
  list: (req: Request<null, null, null>, res: Response) => Promise<void>;
}

const status: Handlers = {
  async create({ body }, res) {
    const { userID } = res.locals;
    const item = await statusDb.insert(body, userID);
    res.send(item);
  },
  async getByID({ params }, res) {
    const item = await statusDb.getByID(params.id);
    if (!item) {
      httpError(res, 404, 'Status not found');
      return;
    }
    res.send(item);
  },
  async list(req, res) {
    const items = await statusDb.list();
    res.send(items);
  },
};

export default status;
