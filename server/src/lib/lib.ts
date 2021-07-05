import { Response } from 'express';
import http from 'http';
import { ID } from './types';
import { logger } from '../config/config';

function filterOutKey<T>(obj: T, key: string): Record<string, unknown> {
  return Object.entries(obj).reduce((s, [k, v]) => {
    if (k === key) return s;
    return { ...s, [k]: v };
  }, {});
}

export function filterOutID<T extends ID>(obj: T): Record<string, unknown> {
  return filterOutKey(obj, '_id');
}

export const httpError = (res: Response, code: number, error: string, message?: unknown): void => {
  if (message) logger.error(message);
  res.status(code).send({ status: http.STATUS_CODES[code], code, error });
};
