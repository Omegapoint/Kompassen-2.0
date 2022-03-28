import { Request, Response } from 'express';
import officeDb from '../../database/offices';
import { httpError } from '../../lib/lib';
import { IDParam } from '../../lib/types';

interface Handlers {
  getByID: (req: Request<IDParam, null, null>, res: Response) => Promise<void>;
  list: (req: Request<null, null, null>, res: Response) => Promise<void>;
}

const offices: Handlers = {
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
