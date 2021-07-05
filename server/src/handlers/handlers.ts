import express, { Express, NextFunction, Request, Response } from 'express';
import cors from 'cors';
import users from './users';
import checkSession from '../lib/auth';
import hasAccess from '../lib/checkAccess';
import { httpError } from '../lib/lib';
import config from '../config/config';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getClaims = async (authStr: string): Promise<any> => {
  const claims = await checkSession(authStr);
  if (!claims) {
    throw Error('Invalid authorization token');
  }
  return claims;
};

const authCheck = async (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;
  let role = null;

  if (authorization) {
    const auth = authorization.split(' ');
    if (auth.length !== 2 || auth[0] !== 'Bearer') {
      httpError(res, 401, 'Only bearer authorization is supported');
      return;
    }
    const claims = await getClaims(auth[1]);
    res.locals.userID = claims.oid;
    role = claims.role || 'admin';
  }

  const access = hasAccess(req.url, req.method, role);
  if (!access) {
    if (access === null) {
      httpError(res, 403, 'User does not have access to the resource');
      return;
    }

    httpError(res, 404, 'Resource not found');
    return;
  }

  next();
};

const loginInfoHandler = (req: Request, res: Response) => {
  res.send({
    clientId: config.oidc.azure.clientID,
    authority: `https://login.microsoftonline.com/${config.oidc.azure.tenantID}`,
    redirectUri: config.oidc.azure.redirectUrl,
  });
};

const setupExpress = (): Express => {
  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use(authCheck);

  app.get('/login/config', loginInfoHandler);

  app.post('/user', users.create);
  app.get('/user', users.get);
  return app;
};

export default setupExpress;
