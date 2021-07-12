import { Reducer, useCallback, useReducer } from 'react';
import { APIFunction, RS, RequestInfo, FetchResult, RequestFn } from './Fetch';
import * as api from './Api';
import {
  Lecture,
  Event,
  NewUser,
  TagStats,
  UpdatedUser,
  User,
  CategoryStats,
  Category,
  NewLectureIdea,
} from './Types';

const initialState = {
  loading: true,
  error: null,
  data: null,
};

interface ReducerAction<Res> {
  type: 'BEFORE' | 'AFTER' | 'SET_REQUEST';
  payload?: FetchResult<Res>;
}

function reducer<Res>(state: RS<Res>, action: ReducerAction<Res>): RS<Res> {
  switch (action.type) {
    case 'BEFORE':
      return { ...initialState };
    case 'AFTER':
      return { ...state, ...action.payload, loading: false };
    default:
      throw new Error('Invalid reducer state');
  }
}

type UseFetchResult<Res, Req = undefined> = [RS<Res>, RequestFn<Req>];

export function useFetchLater<Res, Req = undefined>(
  fn: APIFunction<Res, Req>
): UseFetchResult<Res, Req> {
  const [state, dispatch] = useReducer<Reducer<RS<Res>, ReducerAction<Res>>>(reducer, {
    ...initialState,
  });
  const request = useCallback(
    async (payload?: RequestInfo<Req>) => {
      dispatch({ type: 'BEFORE' });
      const data = await fn(payload);
      dispatch({ type: 'AFTER', payload: data });
    },
    [fn]
  );

  return [state, request];
}

export const useGetUser = (): UseFetchResult<User> => useFetchLater(api.getUser);
export const useCreateUser = (): UseFetchResult<User, NewUser> => useFetchLater(api.createUser);
export const useUpdateUser = (): UseFetchResult<User, UpdatedUser> => useFetchLater(api.updateUser);

export const useListTags = (): UseFetchResult<TagStats[]> => useFetchLater(api.listTags);

export const useListCategories = (): UseFetchResult<Category[]> =>
  useFetchLater(api.listCategories);

export const useCreateLectureIdea = (): UseFetchResult<User, NewLectureIdea> =>
  useFetchLater(api.createLectureIdea);
export const useListLectureCategories = (): UseFetchResult<CategoryStats[]> =>
  useFetchLater(api.listLectureCategories);
export const useLikeLecture = (): UseFetchResult<Lecture[]> => useFetchLater(api.likeLecture);
export const useUnlikeLecture = (): UseFetchResult<Lecture[]> => useFetchLater(api.unlikeLecture);
export const useListLectures = (): UseFetchResult<Lecture[]> => useFetchLater(api.listLectures);

export const useListEvents = (): UseFetchResult<Event[]> => useFetchLater(api.listEvents);
