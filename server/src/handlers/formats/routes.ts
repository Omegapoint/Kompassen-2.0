import { Express } from 'express';
import { admin } from '../auth';
import schema, { validate } from '../validationSchemas';
import format from './handlers';

const formatsRoutes = (app: Express): void => {
  app.post('/format', admin, validate(schema.formats.newFormat), format.create);
  app.get('/format', format.list);
  app.get('/format/:id', admin, validate(schema.uuidParam, 'params'), format.getByID);
};

export default formatsRoutes;
