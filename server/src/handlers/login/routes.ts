import { Express } from 'express';
import login from './handlers';

const loginRoutes = (app: Express): void => {
  app.get('/login/config', login.loginInfoHandler);
};

export default loginRoutes;
