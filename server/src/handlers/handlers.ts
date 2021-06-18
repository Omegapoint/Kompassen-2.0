import express, { Express, Request, Response } from 'express';
import cors from 'cors';
// import mongoClient from '../database/database';

const root = (req: Request, res: Response): void => {
  res.send('Hello Worlds nr 23!');
};

const setupExpress = (): Express => {
  // console.log(mongoClient)
  const app = express();
  app.use(cors());

  app.get('/', root);
  return app;
};

export default setupExpress;
