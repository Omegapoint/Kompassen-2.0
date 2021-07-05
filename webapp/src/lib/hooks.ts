import { Reducer, useCallback, useReducer } from 'react';
import { APIFunction, RS, RequestInfo, FetchResult, RequestFn } from './fetch';
import * as api from './api';
import { NewUser, User } from './types';

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
