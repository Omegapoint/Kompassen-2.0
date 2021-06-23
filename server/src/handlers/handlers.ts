import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import db, { Post } from '../database/database';

const listPosts = async (req: Request, res: Response): Promise<void> => {
  const resp = await db.listPosts(req.app.locals.db);
  res.send(resp);
};

const getPost = async (req: Request, res: Response): Promise<void> => {
  const resp = await db.getPost(req.app.locals.db, req.params.id);
  res.send(resp);
};

const deletePost = async (req: Request, res: Response): Promise<void> => {
  const resp = await db.deletePost(req.app.locals.db, req.params.id);
  res.send({ ok: resp });
};

const createPost = async (req: Request<Post>, res: Response): Promise<void> => {
  req.body.createdAt = new Date();
  req.body.updatedAt = req.body.createdAt;
  const quote = req.body;
  const resp = await db.insertPost(req.app.locals.db, quote);
  res.send({ ok: resp });
};

const updatePost = async (req: Request<Post>, res: Response): Promise<void> => {
  req.body.updatedAt = new Date();
  const quote = req.body;
  const resp = await db.updatePost(req.app.locals.db, quote);
  res.send({ ok: resp });
};

const setupExpress = (): Express => {
  const app = express();
  app.use(cors());
  app.use(express.json());

  app.post('/kompassen', createPost);
  app.put('/kompassen', updatePost);
  app.get('/kompassen', listPosts);
  app.get('/kompassen/:id', getPost);
  app.delete('/kompassen/:id', deletePost);
  return app;
};

export default setupExpress;
