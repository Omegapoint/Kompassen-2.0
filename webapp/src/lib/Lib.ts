import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../reducers';
/* eslint-disable @typescript-eslint/no-explicit-any */

type Body = Record<any, any> | Record<any, any>[];

// eslint-disable-next-line import/prefer-default-export
export const formatDates = (o: Body): any => {
  if (Array.isArray(o)) return o.map(formatDates);

  const r = { ...o };
  if (o.createdAt) r.createdAt = new Date(Date.parse(r.createdAt));
  if (o.updatedAt) r.updatedAt = new Date(Date.parse(r.updatedAt));
  return r;
};

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAppDispatch = (): AppDispatch => useDispatch<AppDispatch>();
