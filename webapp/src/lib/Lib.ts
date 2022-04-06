import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import store, { AppDispatch, RootState } from '../reducers';
import { reviver } from './Types';

export enum ROLE {
  OPKOKO_PLANNER = 'OPKoKoPlanner',
  OPKOKO_PROGRAM_COMMITTEE = 'OPKoKoProgramCommittee',
  COMPETENCE_DAY_PLANNER = 'CompetenceDayPlanner',
  OPKOKO_AWARD_COMMITTEE = 'OPKoKoAwardCommittee',
  ADMIN = 'Admin',
}

/* eslint-disable @typescript-eslint/no-explicit-any */

type Body = Record<any, any> | Record<any, any>[];

export const formatDates = (o: Body): any => {
  if (Array.isArray(o)) return o.map(formatDates);

  return Object.entries(o)
    .map(([k, v]) => ({ [k]: reviver(k, v) }))
    .reduce((s, e) => ({ ...s, ...e }), {});
};

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAppDispatch = (): AppDispatch => useDispatch<AppDispatch>();

export const checkAccess = (roles: ROLE[]): boolean => {
  const sessionRole = store.getState().session.role;
  return roles.some((role) => role === sessionRole);
};

export const formatImgAsSVG = (img: string): string =>
  `data:image/svg+xml;base64,${window.btoa(img)}`;
