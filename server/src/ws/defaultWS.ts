import { Socket } from 'socket.io';
import categoriesDB from '../database/categories';
import eventsDB from '../database/events';
import formatDb from '../database/formats';
import lecturesDB from '../database/lecture';
import officeDb from '../database/offices';
import organisationsDB from '../database/organisations';
import statusDb from '../database/status';
import {
  Category,
  Event,
  Format,
  IDParam,
  Lecture,
  Office,
  Organisation,
  Status,
} from '../lib/types';
import { users } from './types';

function defaultWS<T>(name: string, setupFn: () => Promise<unknown>) {
  function onUpdated(body: T): void {
    users.forEach((user) => {
      user.socket.emit(`${name}/update`, body);
    });
  }

  function onCreated(body: T): void {
    users.forEach((user) => {
      user.socket.emit(`${name}/create`, body);
    });
  }

  function onDelete(id: IDParam): void {
    users.forEach((user) => {
      user.socket.emit(`${name}/delete`, id);
    });
  }

  function setup(socket: Socket): void {
    socket.on(name, async () => {
      const resp = await setupFn();
      socket.emit(name, resp);
    });
  }

  return { onUpdated, onCreated, onDelete, setup };
}

export const lectureIdeasWS = defaultWS<Lecture>('lectureIdeas', () => lecturesDB.list(true));
export const categoriesWS = defaultWS<Category>('categories', categoriesDB.list);
export const eventsWS = defaultWS<Event>('events', eventsDB.list);
export const organisationsWS = defaultWS<Organisation>('organisations', organisationsDB.list);
export const officesWS = defaultWS<Office>('offices', officeDb.list);
export const formatsWS = defaultWS<Format>('formats', formatDb.list);
export const statusesWS = defaultWS<Status>('status', statusDb.list);
