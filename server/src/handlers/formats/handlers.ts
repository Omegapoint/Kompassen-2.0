import { Request, Response } from 'express';
import formatDb from '../../database/formats';
import { httpError } from '../../lib/lib';
import { IDParam, NewFormat } from '../../lib/types';

interface Handlers {
  create: (req: Request<null, null, NewFormat>, res: Response) => Promise<void>;
  getByID: (req: Request<IDParam, null, null>, res: Response) => Promise<void>;
  list: (req: Request<null, null, null>, res: Response) => Promise<void>;
}

const formats: Handlers = {
  async create({ body }, res) {
    const { userID } = res.locals;
    const item = await formatDb.insert(body, userID);
    res.send(item);
  },
  async getByID({ params }, res) {
    const item = await formatDb.getByID(params.id);
    if (!item) {
      httpError(res, 404, 'Format not found');
      return;
    }
    res.send(item);
  },
  async list(req, res) {
    const items = await formatDb.list();
    res.send(items);
  },
};

export default formats;
