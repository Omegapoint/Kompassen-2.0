import {
  HTTPMethod,
  Params,
  RequestInfo,
  deleteJSON,
  getJSON,
  postJSON,
  putJSON,
  APIFunction,
} from './Fetch';
import {
  Lecture,
  NewUser,
  TagStats,
  UpdatedUser,
  User,
  Event,
  CategoryStats,
  Category,
  NewLectureIdea,
  Location,
  NewLecture,
  IDParam,
} from './Types';

const getUrlParams = (url: string, urlParams: Params = {}) =>
  Object.entries(urlParams).reduce((s, [k, v]) => s.replaceAll(`:${k}`, v.toString()), url);

const getQueryParams = (queryParams: Params = {}) => {
  const params = Object.entries(queryParams)
    .map(([k, v]) => `${k}=${v}`)
    .join('&');
  return params.length > 0 ? `?${params}` : params;
};

function formatUrl<T>(url: string, { urlParams, queryParams }: RequestInfo<T>) {
  const formattedUrl = getUrlParams(url, urlParams);
  const qp = getQueryParams(queryParams);
  return formattedUrl + qp;
}

function apiBuilder<Res, Req = undefined>(url: string, method: HTTPMethod): APIFunction<Res, Req> {
  switch (method) {
    case 'GET':
      return (o: RequestInfo<Req> = {}) => getJSON(formatUrl(url, o));
    case 'DELETE':
      return (o: RequestInfo<Req> = {}) => deleteJSON(formatUrl(url, o));
    case 'POST':
      return (o: RequestInfo<Req> = {}) => postJSON(formatUrl(url, o), o.body);
    case 'PUT':
      return (o: RequestInfo<Req> = {}) => putJSON(formatUrl(url, o), o.body);
    default:
      throw Error(`Invalid HTTP method '${method}'`);
  }
}

export const getUser = apiBuilder<User>('/user', 'GET');
export const createUser = apiBuilder<User, NewUser>('/user', 'POST');
export const updateUser = apiBuilder<User, UpdatedUser>('/user', 'PUT');

export const listTags = apiBuilder<TagStats[]>('/lecture/tag', 'GET');

export const listCategories = apiBuilder<Category[]>('/category', 'GET');
export const listLocations = apiBuilder<Location[]>('/location', 'GET');

export const createLecture = apiBuilder<IDParam, NewLecture>('/lecture', 'POST');
export const createLectureIdea = apiBuilder<IDParam, NewLectureIdea>('/lecture/idea', 'POST');
export const listLectureCategories = apiBuilder<CategoryStats[]>('/lecture/:id/category', 'GET');
export const listLectures = apiBuilder<Lecture[]>('/lecture', 'GET');
export const likeLecture = apiBuilder<Lecture[]>('/lecture/:id/like', 'POST');
export const unlikeLecture = apiBuilder<Lecture[]>('/lecture/:id/like', 'DELETE');

export const listEvents = apiBuilder<Event[]>('/event', 'GET');
