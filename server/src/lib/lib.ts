import camelCase from 'camelcase';
import { Response } from 'express';
import http from 'http';
import { logger } from '../config/config';

export const httpError = (res: Response, code: number, error: string, message?: unknown): void => {
  if (message) logger.error(message);
  res.status(code).send({ status: http.STATUS_CODES[code], code, error });
};

export function snakeToCamel<T, Y>(o: T): Y {
  if (Array.isArray(o)) {
    return o.map(snakeToCamel) as unknown as Y;
  }
  if (typeof o !== 'object' || o === null) {
    return o as unknown as Y;
  }

  if (Object.getPrototypeOf(o) === Object.prototype) {
    return Object.entries(o).reduce((s, [k, v]) => {
      const key = camelCase(k);
      if (Array.isArray(v)) {
        return { ...s, [key]: v.map(snakeToCamel) };
      }

      return { ...s, [key]: snakeToCamel(v) };
    }, {}) as Y;
  }

  return o as unknown as Y;
}
