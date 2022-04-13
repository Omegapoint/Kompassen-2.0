import {
  Approved,
  Attendant,
  CategoryStats,
  Event,
  IDParam,
  IOK,
  Lecture,
  ListEventParams,
  ListLecturesParams,
  NewAttendant,
  NewEvent,
  NewLecture,
  NewLectureIdea,
  NewLectureRoom,
  NewUser,
  Office,
  TagStats,
  UpdatedEvent,
  UpdatedLecture,
  UpdatedLectureIdea,
  UpdatedLectureRoom,
  UpdatedUser,
  User,
} from '../lib/Types';
import { deleteJSON, getJSON, postJSON, putJSON } from './Fetch';

const getUrlParams = (url: string, urlParams = {}) =>
  Object.entries(urlParams).reduce(
    (s, [k, v]) => s.replaceAll(`:${k}`, (v as string).toString()),
    url
  );

const getQueryParams = (queryParams = {}) => {
  const params = Object.entries(queryParams)
    .map(([k, v]) => `${k}=${v}`)
    .join('&');
  return params.length > 0 ? `?${params}` : params;
};

interface QueryAPI<Res, Req> {
  get: (params?: Req) => Promise<Res>;
  delete: (params?: Req) => Promise<Res>;
  post: (params?: Req) => Promise<Res>;
  put: (params?: Req) => Promise<Res>;
}

interface URLAPI<Res, Req> {
  get: (params: Req) => Promise<Res>;
  delete: (params: Req) => Promise<Res>;
  post: (params: Req) => Promise<Res>;
  put: (params: Req) => Promise<Res>;
}

interface API<Res, Req> {
  get: () => Promise<Res>;
  delete: () => Promise<Res>;
  post: (o: Req) => Promise<Res>;
  put: (o: Req) => Promise<Res>;
}

function apiBuilder<Res, Req = undefined>(url: string): API<Res, Req> {
  return {
    get: () => getJSON(url),
    delete: () => deleteJSON(url),
    post: (o: Req) => postJSON(url, o),
    put: (o: Req) => putJSON(url, o),
  };
}

function apiQueryBuilder<Res, Req>(url: string): QueryAPI<Res, Req> {
  return {
    get: (params?: Req) => getJSON(url + getQueryParams(params)),
    delete: (params?: Req) => deleteJSON(url + getQueryParams(params)),
    post: (params?: Req) => postJSON(url + getQueryParams(params), {}),
    put: (params?: Req) => putJSON(url + getQueryParams(params), {}),
  };
}

function apiURLParamsBuilder<Res, Req>(url: string): URLAPI<Res, Req> {
  return {
    get: (params: Req) => getJSON(getUrlParams(url, params)),
    delete: (params: Req) => deleteJSON(getUrlParams(url, params)),
    post: (params: Req) => postJSON(getUrlParams(url, params), {}),
    put: (params: Req) => putJSON(getUrlParams(url, params), {}),
  };
}

export const userExists = apiBuilder<IOK>('/user/exists').get;
export const getUser = apiBuilder<User>('/user').get;
export const getUserByID = apiURLParamsBuilder<User, IDParam>('/user/:id').get;
export const createUser = apiBuilder<User, NewUser>('/user').post;
export const updateUser = apiBuilder<User, UpdatedUser>('/user').put;

export const listTags = apiBuilder<TagStats[]>('/lecture/tag').get;

export const listEventLectures = apiURLParamsBuilder<Lecture[], IDParam>('/event/:id/lecture').get;
export const createEvent = apiBuilder<IDParam, NewEvent>('/event').post;
export const updateEvent = apiBuilder<IDParam, UpdatedEvent>('/event').put;
export const deleteEvent = apiURLParamsBuilder<IDParam, IDParam>('/event/:id').delete;

export const createLectureRoom = apiBuilder<IDParam, NewLectureRoom>('/event/room/lecture').post;
export const updateLectureRoom = apiBuilder<IDParam, UpdatedLectureRoom>('/event/room/lecture').put;
export const deleteLectureRoom = apiURLParamsBuilder<IDParam, IDParam>(
  '/event/room/lecture/:id'
).delete;

export const createAttendance = apiBuilder<IDParam, NewAttendant>('/attendant').post;
export const getAttendanceByEventID = apiURLParamsBuilder<Attendant[], IDParam>(
  '/attendant/:id'
).get;
export const isAttending = apiURLParamsBuilder<IOK, IDParam>('/attendant/:id/attending').get;
export const deleteAttendance = apiURLParamsBuilder<IDParam, IDParam>('/attendant/:id').delete;

export const approveLecture = apiBuilder<IDParam, Approved>('/lecture/approve').post;
export const updateLecture = apiBuilder<IDParam, UpdatedLecture>('/lecture').put;
export const createLecture = apiBuilder<IDParam, NewLecture>('/lecture').post;
export const deleteLecture = apiURLParamsBuilder<IDParam, IDParam>('/lecture/:id').delete;
export const createLectureIdea = apiBuilder<IDParam, NewLectureIdea>('/lecture/idea').post;
export const updateLectureIdea = apiBuilder<IDParam, UpdatedLectureIdea>('/lecture/idea').put;
export const listLectureCategories = apiURLParamsBuilder<CategoryStats[], IDParam>(
  '/lecture/:id/category'
).get;
export const listLectures = apiQueryBuilder<Lecture[], ListLecturesParams>('/lecture').get;
export const getLecture = apiURLParamsBuilder<Lecture, IDParam>('/lecture/:id').get;
export const likeLecture = apiURLParamsBuilder<Lecture[], IDParam>('/lecture/:id/like').post;
export const unlikeLecture = apiURLParamsBuilder<Lecture[], IDParam>('/lecture/:id/like').delete;

export const listEvents = apiQueryBuilder<Event[], ListEventParams>('/event').get;
export const getEvent = apiURLParamsBuilder<Event, IDParam>('/event/:id').get;

export const listOffices = apiQueryBuilder<Office[], ListEventParams>('/office').get;
export const getOffice = apiURLParamsBuilder<Office, IDParam>('/office/:id').get;
