import { Request, Response } from 'express';
import eventsDB from '../../database/events';
import lecturesDB from '../../database/lecture';
import { httpError } from '../../lib/lib';
import { IDParam, ListEventParams, NewEvent, UpdatedEvent } from '../../lib/types';
import { eventsWS } from '../../ws/defaultWS';

interface Handlers {
  create: (req: Request<null, null, NewEvent>, res: Response) => Promise<void>;
  update: (req: Request<null, null, UpdatedEvent>, res: Response) => Promise<void>;
  getByID: (req: Request<IDParam, null, null>, res: Response) => Promise<void>;
  list: (req: Request<null, ListEventParams, null>, res: Response) => Promise<void>;
  listEventLectures: (req: Request<IDParam, null, null>, res: Response) => Promise<void>;
  delete: (req: Request<IDParam, null, null>, res: Response) => Promise<void>;
}

const events: Handlers = {
  async create({ body }, res) {
    const { userID } = res.locals;
    const item = await eventsDB.insert(body, userID);

    const event = await eventsDB.getByID(item.id);
    if (event) {
      eventsWS.onCreated(event);
    }
    res.send(item);
  },
  async update({ body }, res) {
    const { userID } = res.locals;
    const item = await eventsDB.update(body, userID);

    const event = await eventsDB.getByID(item.id);
    if (event) {
      eventsWS.onUpdated(event);
    }
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
  async listEventLectures({ params }, res) {
    const items = await lecturesDB.listEventLectures(params.id);
    res.send(items);
  },
  async delete({ params }, res) {
    const item = await eventsDB.delete(params.id);
    if (!item) {
      httpError(res, 404, 'Event not found');
      return;
    }

    eventsWS.onDelete({ id: params.id });
    res.send(item);
  },
};

export default events;
