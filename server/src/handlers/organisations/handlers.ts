import { Request, Response } from 'express';
import organisationsDB from '../../database/organisations';
import { httpError } from '../../lib/lib';
import { IDParam, NewOrganisation, UpdatedOrganisation } from '../../lib/types';
import { organisationsWS } from '../../ws/defaultWS';

interface Handlers {
  create: (req: Request<null, null, NewOrganisation>, res: Response) => Promise<void>;
  update: (req: Request<null, null, UpdatedOrganisation>, res: Response) => Promise<void>;
  getByID: (req: Request<IDParam, null, null>, res: Response) => Promise<void>;
  list: (req: Request<null, null, null>, res: Response) => Promise<void>;
  delete: (req: Request<IDParam, null, null>, res: Response) => Promise<void>;
}

const organisations: Handlers = {
  async create({ body }, res) {
    const { userID } = res.locals;
    const item = await organisationsDB.insert(body, userID);

    const organisation = await organisationsDB.getByID(item.id);
    if (organisation) {
      organisationsWS.onCreated(organisation);
    }
    res.send(item);
  },
  async update({ body }, res) {
    const { userID } = res.locals;
    const item = await organisationsDB.update(body, userID);

    const organisation = await organisationsDB.getByID(item.id);
    if (organisation) {
      organisationsWS.onUpdated(organisation);
    }
    res.send(item);
  },
  async getByID({ params }, res) {
    const item = await organisationsDB.getByID(params.id);
    if (!item) {
      httpError(res, 404, 'Organisation not found');
      return;
    }
    res.send(item);
  },
  async list(req, res) {
    const items = await organisationsDB.list();
    res.send(items);
  },
  async delete({ params }, res) {
    const item = await organisationsDB.delete(params.id);
    if (!item) {
      httpError(res, 404, 'Organisation not found');
      return;
    }

    organisationsWS.onDelete({ id: params.id });
    res.send(item);
  },
};

export default organisations;
