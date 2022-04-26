import { useEffect, useState } from 'react';
import useUnmount from '../hooks/UseUnmount';
import { formatDates, useAppDispatch, useAppSelector } from '../lib/Lib';
import { IDParam } from '../lib/Types';
import actions from '../reducers/actions';

interface Action<T> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  set: (body: T[]) => any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  update: (body: T) => any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  delete: (body: IDParam) => any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  create: (body: T) => any;
}

function genUseReduxWS<T>(name: string, reduxActions: Action<T>): () => boolean {
  return () => {
    const socket = useAppSelector((state) => state.session.socket);
    const mounted = useUnmount();
    const dispatch = useAppDispatch();
    const [ready, setReady] = useState(false);

    useEffect(() => {
      if (socket) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        socket.on(name, (lectures) => {
          if (mounted.current) {
            dispatch(reduxActions.set(formatDates(lectures)));
            setReady(true);
          }
        });

        socket.on(`${name}/update`, (lecture: T) => {
          if (mounted.current) {
            dispatch(reduxActions.update(formatDates(lecture)));
          }
        });

        socket.on(`${name}/create`, (lecture: T) => {
          if (mounted.current) {
            dispatch(reduxActions.create(formatDates(lecture)));
          }
        });

        socket.on(`${name}/delete`, (lecture: IDParam) => {
          if (mounted.current) {
            dispatch(reduxActions.delete(formatDates(lecture)));
          }
        });
        socket.emit(name);
      }
      return () => {};
    }, [dispatch, mounted, socket]);
    return ready;
  };
}

export const useCategoriesWS = genUseReduxWS('categories', actions.categories);
export const useEventsWS = genUseReduxWS('events', actions.events);
export const useOrganisationsWS = genUseReduxWS('organisations', actions.organisations);
export const useOfficesWS = genUseReduxWS('offices', actions.offices);
export const useFormatsWS = genUseReduxWS('formats', actions.formats);
export const useStatusWS = genUseReduxWS('status', actions.status);
