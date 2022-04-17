import { Request, Response } from 'express';
import { IDParam } from '../../lib/types';
import { getAzureUser } from './graphAPI';

interface Handlers {
  getUserInfoByID: (req: Request<IDParam, null, null>, res: Response) => Promise<void>;
  getUserPictureByID: (req: Request<IDParam, null, null>, res: Response) => Promise<void>;
}

const graph: Handlers = {
  async getUserInfoByID({ params }, res) {
    // const { userID } = res.locals;
    const item = await getAzureUser(params.id);
    res.send(item);
  },
  async getUserPictureByID({ params }, res) {
    const item = await getAzureUser(params.id);
    res.send(item);
  },
};

export default graph;
