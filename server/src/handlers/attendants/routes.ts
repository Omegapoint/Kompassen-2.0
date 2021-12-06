import { Express } from 'express';
import { admin, locked } from '../auth';
import schema, { validate } from '../validationSchemas';
import attendants from './handlers';

const attendantsRoutes = (app: Express): void => {
  app.post('/attendant', locked, validate(schema.attendants.newAttendant), attendants.create);
  app.get(
    '/attendant/:id',
    admin,
    validate(schema.uuidParam, 'params'),
    attendants.getAttendanceByEventID
  );
  app.get(
    '/attendant/:id/attending',
    locked,
    validate(schema.uuidParam, 'params'),
    attendants.isAttending
  );
  app.delete('/attendant/:id', locked, validate(schema.uuidParam, 'params'), attendants.delete);
};

export default attendantsRoutes;
