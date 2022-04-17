import { Express } from 'express';
import { locked } from '../auth';
import schema, { validate } from '../validationSchemas';
import graph from './handlers';

const graphRoutes = (app: Express): void => {
  app.get('/graph/:id', locked, validate(schema.uuidParam, 'params'), graph.getUserInfoByID);
  app.get(
    '/graph/picture/:id',
    locked,
    validate(schema.uuidParam, 'params'),
    graph.getUserPictureByID
  );
};

export default graphRoutes;
