import { Request, Response } from 'express';
import locationsDB from '../../database/locations';
import { httpError } from '../../lib/lib';
import { IDParam, NewLocation, UpdatedLocation } from '../../lib/types';

interface Handlers {
  create: (req: Request<null, null, NewLocation>, res: Response) => Promise<void>;
  update: (req: Request<null, null, UpdatedLocation>, res: Response) => Promise<void>;
  getByID: (req: Request<IDParam, null, null>, res: Response) => Promise<void>;
  list: (req: Request<null, null, null>, res: Response) => Promise<void>;
  delete: (req: Request<IDParam, null, null>, res: Response) => Promise<void>;
}

const locations: Handlers = {
  async create({ body }, res) {
    const { userId } = res.locals;
    const item = await locationsDB.insert(body, userId);
    res.send(item);
  },
  async update({ body }, res) {
    const { userId } = res.locals;
    const item = await locationsDB.update(body, userId);
    res.send(item);
  },
  async getByID({ params }, res) {
    const item = await locationsDB.getByID(params.id);
    if (!item) {
      httpError(res, 404, 'Location not found');
      return;
    }
    res.send(item);
  },
  async list(req, res) {
    const items = await locationsDB.list();
    res.send(items);
  },
  async delete({ params }, res) {
    const item = await locationsDB.delete(params.id);
    if (!item) {
      httpError(res, 404, 'Location not found');
      return;
    }
    res.send(item);
  },
};

export default locations;
