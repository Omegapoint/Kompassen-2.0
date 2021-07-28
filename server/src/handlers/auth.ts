import { NextFunction, Request, Response } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import checkSession from '../lib/auth';
import { httpError } from '../lib/lib';

export const getClaims = async (authStr: string): Promise<JwtPayload | null> => {
  const claims = await checkSession(authStr);
  if (!claims) return null;
  return claims;
};

const checkAuth = async (req: Request, res: Response, next: NextFunction, onlyAdmin: boolean) => {
  const { authorization } = req.headers;
  if (!authorization) {
    httpError(res, 401, 'Missing authorization header');
    return;
  }

  const auth = authorization.split(' ');
  if (auth.length !== 2 || auth[0] !== 'Bearer') {
    httpError(res, 401, 'Only bearer authorization is supported');
    return;
  }

  const claims = await getClaims(auth[1]);
  if (claims === null) {
    httpError(res, 401, 'Invalid authorization token');
    return;
  }

  const role = claims.roles ? claims.roles[0] : 'Worker';

  res.locals.userId = claims.oid;
  res.locals.name = claims.name;
  res.locals.role = role;

  if (onlyAdmin && role !== 'Admin') {
    httpError(res, 403, 'User does not have access to the resource');
    return;
  }
  next();
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const locked: any = async (req: Request, res: Response, next: NextFunction) =>
  checkAuth(req, res, next, false);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const admin: any = async (req: Request, res: Response, next: NextFunction) =>
  checkAuth(req, res, next, true);
