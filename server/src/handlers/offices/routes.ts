import { Express } from 'express';
import { locked } from '../auth';
import schema, { validate } from '../validationSchemas';
import offices from './handlers';

const categoriesRoutes = (app: Express): void => {
  app.get('/office', locked, offices.list);
  app.get('/office/:id', locked, validate(schema.uuidParam, 'params'), offices.getByID);
};

export default categoriesRoutes;
