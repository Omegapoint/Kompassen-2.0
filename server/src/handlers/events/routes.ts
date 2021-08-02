import { Express } from 'express';
import { admin, locked } from '../auth';
import schema, { validate } from '../validationSchemas';
import events from './handlers';

const eventsRoutes = (app: Express): void => {
  app.post('/event', admin, validate(schema.events.newEvent), events.create);
  app.put('/event', admin, validate(schema.events.updateEvent), events.update);
  app.delete('/event/:id', admin, validate(schema.uuidParam, 'params'), events.delete);
  app.get('/event', locked, validate(schema.events.filterEvents), events.list);
  app.get('/event/:id', locked, validate(schema.uuidParam, 'params'), events.getByID);
  app.get(
    '/event/:id/lecture',
    locked,
    validate(schema.uuidParam, 'params'),
    events.listEventLectures
  );
};

export default eventsRoutes;
