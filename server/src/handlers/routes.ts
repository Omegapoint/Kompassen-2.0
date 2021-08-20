import cors from 'cors';
import express, { Express, NextFunction, Request, Response } from 'express';
import { logger } from '../config/config';
import { reviver } from '../lib/types';
import categoriesRoutes from './categories/routes';
import eventsRoutes from './events/routes';
import lectureLikesRoutes from './lectureLikes/routes';
import lectureRoomsRoutes from './lectureRooms/routes';
import lecturesRoutes from './lectures/routes';
import locationRoutes from './locations/routes';
import loginRoutes from './login/routes';
import organisationRoutes from './organisations/routes';
import userRoutes from './users/routes';

const loggingMiddleware = (req: Request, res: Response, next: NextFunction) => {
  logger.info(`Incoming request ${req.method} ${req.url}`);
  next();
};

const setupExpress = (): Express => {
  const app = express();
  app.use(
    cors({
      origin: 'http://localhost:3000',
    })
  );
  app.use(express.json({ reviver }));
  app.use(loggingMiddleware);

  const routes = [
    categoriesRoutes,
    eventsRoutes,
    lecturesRoutes,
    locationRoutes,
    organisationRoutes,
    loginRoutes,
    userRoutes,
    lectureLikesRoutes,
    lectureRoomsRoutes,
  ];
  routes.forEach((fn) => fn(app));
  return app;
};

export default setupExpress;
