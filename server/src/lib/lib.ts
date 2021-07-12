import { Response } from 'express';
import http from 'http';
import { logger } from '../config/config';
import camelCase from 'camelcase';

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

export const STRING_MIN_LEN = 1;
export const SHORT_STRING_LEN = 50;
export const LARGE_STRING_LEN = 500;
export const FILE_LEN = 1024 * 1024;

export function first<T>([e]: Array<T>): T {
  return e;
}

interface Author {
  createdBy: string;
  updatedBy: string;
}

export function createAuthor(userID: string): Author {
  return { createdBy: userID, updatedBy: userID };
}

export const formatItems = (li: string[], table: string): string[] =>
  li.map((e) => `${table}.${e}`);
