export type HTTPMethod = 'GET' | 'DELETE' | 'POST' | 'PUT';

export const BASE_HTTP_URL = 'http://localhost:8080' || window.location.origin;

export interface HTTPError {
  status: string;
  code: number;
  error: string;
}

export interface FetchResult<Res> {
  error: HTTPError | null;
  data: Res | null;
}

export async function fetchJSON<Res>(
  url: string,
  options: RequestInit = {}
): Promise<FetchResult<Res>> {
  const accessToken = sessionStorage.getItem('accessToken');

  const fetchOptions = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      accept: 'application/json',
      authorization: `Bearer ${accessToken}`,
    },
  };

  try {
    const resp = await fetch(BASE_HTTP_URL + url, fetchOptions);

    const data = resp.status === 204 ? null : await resp.json();

    if (resp.status >= 400) {
      return { error: data, data: null };
    }
    return { error: null, data };
  } catch (e) {
    return {
      error: {
        status: 'ERR_CONNECTION_REFUSED',
        code: 0,
        error: 'could not connect to server',
      },
      data: null,
    };
  }
}

export type RequestFn<Req> = (payload?: RequestInfo<Req>) => Promise<void>;

export interface RS<Res> {
  loading: boolean;
  error: HTTPError | null;
  data: Res | null;
}

export interface Params {
  [key: string]: string | number | boolean;
}

export interface RequestInfo<Req> {
  body?: Req;
  urlParams?: Params;
  queryParams?: Params;
}

export type APIFunction<Res, Req> = (o?: RequestInfo<Req>) => Promise<FetchResult<Res>>;

export function getJSON<Res>(url: string): Promise<FetchResult<Res>> {
  return fetchJSON(url, { method: 'GET' });
}
export function deleteJSON<Res>(url: string): Promise<FetchResult<Res>> {
  return fetchJSON(url, { method: 'DELETE' });
}
export function postJSON<Res, Req>(url: string, body: Req): Promise<FetchResult<Res>> {
  return fetchJSON(url, { method: 'POST', body: JSON.stringify(body) });
}

export function putJSON<Res, Req>(url: string, body: Req): Promise<FetchResult<Res>> {
  return fetchJSON(url, { method: 'PUT', body: JSON.stringify(body) });
}
