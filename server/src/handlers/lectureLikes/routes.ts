import schema, { validate } from '../validationSchemas';
import { Express } from 'express';
import { admin } from '../auth';
import lectureLikes from './handlers';

const lectureLikesRoutes = (app: Express): void => {
  app.post('/lecture/:id/like', admin, validate(schema.uuidParam, 'params'), lectureLikes.create);
  app.delete('/lecture/:id/like', admin, validate(schema.uuidParam, 'params'), lectureLikes.delete);
};

export default lectureLikesRoutes;
