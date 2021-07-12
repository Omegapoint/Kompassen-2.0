import schema, { validate } from '../validationSchemas';
import { Express } from 'express';
import { locked } from '../auth';
import users from './handlers';

const userRoutes = (app: Express): void => {
  app.post('/user', locked, validate(schema.users.newUser), users.createUser);
  app.put('/user', locked, validate(schema.users.updateUser), users.updateUser);
  app.get('/user', locked, users.getUser);
};

export default userRoutes;
