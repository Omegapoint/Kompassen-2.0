import { Request, Response } from 'express';
import categoriesDB from '../../database/categories';
import { httpError } from '../../lib/lib';
import { IDParam, NewCategory, UpdatedCategory } from '../../lib/types';
import { categoriesWS } from '../../ws/defaultWS';

interface Handlers {
  create: (req: Request<null, null, NewCategory>, res: Response) => Promise<void>;
  update: (req: Request<null, null, UpdatedCategory>, res: Response) => Promise<void>;
  getByID: (req: Request<IDParam, null, null>, res: Response) => Promise<void>;
  list: (req: Request<null, null, null>, res: Response) => Promise<void>;
  delete: (req: Request<IDParam, null, null>, res: Response) => Promise<void>;
}

const categories: Handlers = {
  async create({ body }, res) {
    const { userID } = res.locals;
    const item = await categoriesDB.insert(body, userID);

    const category = await categoriesDB.getByID(item.id);
    if (category) {
      categoriesWS.onCreated(category);
    }
    res.send(item);
  },
  async update({ body }, res) {
    const { userID } = res.locals;
    const item = await categoriesDB.update(body, userID);

    const category = await categoriesDB.getByID(item.id);
    if (category) {
      categoriesWS.onUpdated(category);
    }
    res.send(item);
  },
  async getByID({ params }, res) {
    const item = await categoriesDB.getByID(params.id);
    if (!item) {
      httpError(res, 404, 'Category not found');
      return;
    }
    res.send(item);
  },
  async list(req, res) {
    const items = await categoriesDB.list();
    res.send(items);
  },
  async delete({ params }, res) {
    const item = await categoriesDB.delete(params.id);
    if (!item) {
      httpError(res, 404, 'Category not found');
      return;
    }

    categoriesWS.onDelete({ id: params.id });
    res.send(item);
  },
};

export default categories;
