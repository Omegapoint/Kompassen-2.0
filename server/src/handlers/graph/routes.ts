import { Express } from 'express';
import schema, { validate } from '../validationSchemas';
import graph from './handlers';

const graphRoutes = (app: Express): void => {
  app.get('/graph/:id', validate(schema.uuidParam, 'params'), graph.getUserInfoByID);
  app.get('/graph/picture/:id', validate(schema.uuidParam, 'params'), graph.getUserPictureByID);
};

export default graphRoutes;
