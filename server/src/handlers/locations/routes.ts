import schema, { validate } from '../validationSchemas';
import { Express } from 'express';
import { admin, locked } from '../auth';
import events from '../events/handlers';

const locationRoutes = (app: Express): void => {
  app.post('/location', admin, validate(schema.locations.newLocation), events.create);
  app.put('/location', admin, validate(schema.locations.updateLocation), events.update);
  app.delete('/location/:id', admin, validate(schema.uuidParam, 'params'), events.delete);
  app.get('/location', locked, events.list);
  app.get('/location/:id', locked, validate(schema.uuidParam, 'params'), events.getByID);
};

export default locationRoutes;
