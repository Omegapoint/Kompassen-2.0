import { Express } from 'express';
import { admin } from '../auth';
import schema, { validate } from '../validationSchemas';
import status from './handlers';

const statusRoutes = (app: Express): void => {
  app.post('/status', admin, validate(schema.status.newStatus), status.create);
  app.get('/status', status.list);
  app.get('/status/:id', admin, validate(schema.uuidParam, 'params'), status.getByID);
};

export default statusRoutes;
