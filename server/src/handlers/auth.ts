/* eslint-disable @typescript-eslint/no-explicit-any */
import checkSession from '../lib/auth';
import { NextFunction, Request, Response } from 'express';
import { httpError } from '../lib/lib';

export const getClaims = async (authStr: string): Promise<any | null> => {
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

  res.locals.userId = claims.oid;
  res.locals.name = claims.name;

  if (onlyAdmin) {
    const role = claims.role || 'admin';
    if (role !== 'admin') {
      httpError(res, 403, 'User does not have access to the resource');
      return;
    }
  }
  next();
};

export const locked: any = async (req: Request, res: Response, next: NextFunction) =>
  checkAuth(req, res, next, false);

export const admin: any = async (req: Request, res: Response, next: NextFunction) =>
  checkAuth(req, res, next, true);
