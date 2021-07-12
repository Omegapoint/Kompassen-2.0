import { httpError } from '../../lib/lib';
import { Request, Response } from 'express';
import { IDParam, ListEventParams, NewEvent, UpdatedEvent } from '../../lib/types';
import eventsDB from '../../database/events';

interface Handlers {
  create: (req: Request<null, null, NewEvent>, res: Response) => Promise<void>;
  update: (req: Request<null, null, UpdatedEvent>, res: Response) => Promise<void>;
  getByID: (req: Request<IDParam, null, null>, res: Response) => Promise<void>;
  list: (req: Request<null, ListEventParams, null>, res: Response) => Promise<void>;
  delete: (req: Request<IDParam, null, null>, res: Response) => Promise<void>;
}

const events: Handlers = {
  async create({ body }, res) {
    const { userId } = res.locals;
    const item = await eventsDB.insert(body, userId);
    res.send(item);
  },
  async update({ body }, res) {
    const { userId } = res.locals;
    const item = await eventsDB.update(body, userId);
    res.send(item);
  },
  async getByID({ params }, res) {
    const item = await eventsDB.getByID(params.id);
    if (!item) {
      httpError(res, 404, 'Event not found');
      return;
    }
    res.send(item);
  },
  async list(req, res) {
    const f = req.query.filter;

    const items = await eventsDB.list(f === 'new');
    res.send(items);
  },
  async delete({ params }, res) {
    const item = await eventsDB.delete(params.id);
    if (!item) {
      httpError(res, 404, 'Event not found');
      return;
    }
    res.send(item);
  },
};

export default events;
