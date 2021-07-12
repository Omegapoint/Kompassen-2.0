import express, { Express, NextFunction, Request, Response } from 'express';
import cors from 'cors';
import userRoutes from './users/routes';
import locationRoutes from './locations/routes';
import loginRoutes from './login/routes';
import categoriesRoutes from './categories/routes';
import eventsRoutes from './events/routes';
import lecturesRoutes from './lectures/routes';
import { logger } from '../config/config';
import { reviver } from '../lib/types';
import lectureLikesRoutes from './lectureLikes/routes';

const loggingMiddleware = (req: Request, res: Response, next: NextFunction) => {
  logger.info(`Incoming request ${req.method} ${req.url}`);
  next();
};

const setupExpress = (): Express => {
  const app = express();
  app.use(cors());
  app.use(express.json({ reviver }));
  app.use(loggingMiddleware);

  const routes = [
    categoriesRoutes,
    eventsRoutes,
    lecturesRoutes,
    locationRoutes,
    loginRoutes,
    userRoutes,
    lectureLikesRoutes,
  ];
  routes.forEach((fn) => fn(app));
  return app;
};

export default setupExpress;
