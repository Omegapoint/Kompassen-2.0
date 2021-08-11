import { reviver } from '../lib/Types';
import store from '../reducers';

export const BASE_HTTP_URL = `${window.location.origin}/api`;
export const BASE_WS_URL = (
  window.location.hostname === 'localhost' ? 'http://localhost:8080' : window.location.origin
).replace('http', 'ws');

class FetchError extends Error {
  constructor(public res: Response, message?: string) {
    super(message);
  }
}

export async function fetchJSON<Res>(url: string, options: RequestInit = {}): Promise<Res> {
  const accessToken = store.getState().session.apiToken;

  const fetchOptions = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      accept: 'application/json',
      authorization: `Bearer ${accessToken}`,
    },
  };

  const resp = await fetch(BASE_HTTP_URL + url, fetchOptions);
  const text = await resp.text();
  const data = JSON.parse(text, reviver);

  if (resp.status >= 400) {
    throw new FetchError(resp);
  }
  return data;
}

export type APIFunction<Res, Req> = (o?: Req) => Promise<Res>;

export function getJSON<Res>(url: string): Promise<Res> {
  return fetchJSON(url, { method: 'GET' });
}

export function deleteJSON<Res>(url: string): Promise<Res> {
  return fetchJSON(url, { method: 'DELETE' });
}

export function postJSON<Res, Req>(url: string, body: Req): Promise<Res> {
  return fetchJSON(url, { method: 'POST', body: JSON.stringify(body) });
}

export function putJSON<Res, Req>(url: string, body: Req): Promise<Res> {
  return fetchJSON(url, { method: 'PUT', body: JSON.stringify(body) });
}
