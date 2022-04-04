import { Request, Response } from 'express';
import officeDb from '../../database/offices';
import { httpError } from '../../lib/lib';

import { IDParam, NewOffice } from '../../lib/types';

interface Handlers {
  create: (req: Request<null, null, NewOffice>, res: Response) => Promise<void>;
  getByID: (req: Request<IDParam, null, null>, res: Response) => Promise<void>;
  list: (req: Request<null, null, null>, res: Response) => Promise<void>;
}

const offices: Handlers = {
  async create({ body }, res) {
    const { userID } = res.locals;
    const item = await officeDb.insert(body, userID);
    res.send(item);
  },
  async getByID({ params }, res) {
    const item = await officeDb.getByID(params.id);
    if (!item) {
      httpError(res, 404, 'Office not found');
      return;
    }
    res.send(item);
  },
  async list(req, res) {
    const items = await officeDb.list();
    res.send(items);
  },
};

export default offices;
