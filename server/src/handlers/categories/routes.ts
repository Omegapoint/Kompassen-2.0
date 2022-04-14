import { Express } from 'express';
import { admin, locked } from '../auth';
import schema, { validate } from '../validationSchemas';
import categories from './handlers';

const categoriesRoutes = (app: Express): void => {
  app.post('/category', admin, validate(schema.categories.newCategory), categories.create);
  app.put('/category', admin, validate(schema.categories.updateCategory), categories.update);
  app.delete('/category/:id', admin, validate(schema.uuidParam, 'params'), categories.delete);
  app.get('/category', categories.list);
  app.get('/category/:id', locked, validate(schema.uuidParam, 'params'), categories.getByID);
};

export default categoriesRoutes;
