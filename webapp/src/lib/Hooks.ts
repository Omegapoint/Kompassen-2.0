import { Reducer, useCallback, useReducer } from 'react';
import { APIFunction, RS, RequestInfo, FetchResult, RequestFn } from './Fetch';
import * as api from './Api';
import UseUnmount from '../hooks/UseUnmount';

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

export type UseFetchResult<Res, Req = undefined> = [RS<Res>, RequestFn<Req, Res>];

export function useFetchLater<Res, Req = undefined>(
  fn: APIFunction<Res, Req>
): UseFetchResult<Res, Req> {
  const [state, dispatch] = useReducer<Reducer<RS<Res>, ReducerAction<Res>>>(reducer, {
    ...initialState,
  });
  const mounted = UseUnmount();

  const request = useCallback(
    async (payload?: RequestInfo<Req>) => {
      dispatch({ type: 'BEFORE' });
      const data = await fn(payload);
      if (mounted.current) {
        dispatch({ type: 'AFTER', payload: data });
      }

      return data;
    },

    [fn, mounted]
  );

  return [state, request];
}

export const genUseFetchLater =
  <Res, Req>(fn: APIFunction<Res, Req>) =>
  (): UseFetchResult<Res, Req> =>
    useFetchLater(fn);

export const useGetUser = genUseFetchLater(api.getUser);
export const useCreateUser = genUseFetchLater(api.createUser);
export const useUpdateUser = genUseFetchLater(api.updateUser);

export const useListTags = genUseFetchLater(api.listTags);

export const useListCategories = genUseFetchLater(api.listCategories);
export const useListLocations = genUseFetchLater(api.listLocations);

export const useUpdateLecture = genUseFetchLater(api.updateLecture);
export const useCreateLecture = genUseFetchLater(api.createLecture);
export const useCreateLectureIdea = genUseFetchLater(api.createLectureIdea);
export const useListLectureCategories = genUseFetchLater(api.listLectureCategories);
export const useLikeLecture = genUseFetchLater(api.likeLecture);
export const useUnlikeLecture = genUseFetchLater(api.unlikeLecture);
export const useListLectures = genUseFetchLater(api.listLectures);
export const useGetLecture = genUseFetchLater(api.getLecture);

export const useListEvents = genUseFetchLater(api.listEvents);
