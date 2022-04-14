import { Express } from 'express';
import { locked } from '../auth';
import schema, { validate } from '../validationSchemas';
import users from './handlers';

const userRoutes = (app: Express): void => {
  app.post('/user', locked, validate(schema.users.newUser), users.createUser);
  app.put('/user', locked, validate(schema.users.updateUser), users.updateUser);
  app.get('/user', locked, users.getUser);
  app.get('/user/exists', locked, users.existsByID);
  app.get('/user/:id', locked, validate(schema.uuidParam, 'params'), users.getUserByID);
};

export default userRoutes;
