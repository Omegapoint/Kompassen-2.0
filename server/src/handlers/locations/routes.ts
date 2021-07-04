import schema, { validate } from '../validationSchemas';
import { Express } from 'express';
import { admin, locked } from '../auth';
import locations from './handlers';

const locationRoutes = (app: Express): void => {
  app.post('/location', admin, validate(schema.locations.newLocation), locations.create);
  app.put('/location', admin, validate(schema.locations.updateLocation), locations.update);
  app.delete('/location/:id', admin, validate(schema.uuidParam, 'params'), locations.delete);
  app.get('/location', locked, locations.list);
  app.get('/location/:id', locked, validate(schema.uuidParam, 'params'), locations.getByID);
};

export default locationRoutes;
