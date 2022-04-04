import { Express } from 'express';
import { admin } from '../auth';
import schema, { validate } from '../validationSchemas';
import offices from './handlers';

const officesRoutes = (app: Express): void => {
  app.post('/office', admin, validate(schema.offices.newOffice), offices.create);
  app.get('/office', offices.list);
  app.get('/office/:id', admin, validate(schema.uuidParam, 'params'), offices.getByID);
};

export default officesRoutes;
