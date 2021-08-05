import { Express } from 'express';
import { locked } from '../auth';
import schema, { validate } from '../validationSchemas';
import lectureLikes from './handlers';

const lectureLikesRoutes = (app: Express): void => {
  app.post('/lecture/:id/like', locked, validate(schema.uuidParam, 'params'), lectureLikes.create);
  app.delete(
    '/lecture/:id/like',
    locked,
    validate(schema.uuidParam, 'params'),
    lectureLikes.delete
  );
};

export default lectureLikesRoutes;
