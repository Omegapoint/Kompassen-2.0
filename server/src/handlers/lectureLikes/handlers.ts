import { httpError } from '../../lib/lib';
import { Request, Response } from 'express';
import { IDParam } from '../../lib/types';
import lectureLikesDB from '../../database/lectureLikes';

interface Handlers {
  create: (req: Request<IDParam, null, null>, res: Response) => Promise<void>;
  delete: (req: Request<IDParam, null, null>, res: Response) => Promise<void>;
}

const lectureLikes: Handlers = {
  async create({ params }, res) {
    const { userId } = res.locals;
    const item = await lectureLikesDB.insert({ lectureId: params.id }, userId);
    res.send(item);
  },
  async delete({ params }, res) {
    const { userId } = res.locals;
    const item = await lectureLikesDB.delete(params.id, userId);
    if (!item) {
      httpError(res, 404, 'Lecture not found');
      return;
    }
    res.send(item);
  },
};

export default lectureLikes;
