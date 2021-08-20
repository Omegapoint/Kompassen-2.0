import { Socket } from 'socket.io';
import categoriesDB from '../database/categories';
import eventsDB from '../database/events';
import lecturesDB from '../database/lecture';
import locationsDB from '../database/locations';
import organisationsDB from '../database/organisations';
import { Category, Event, IDParam, Lecture, Location, Organisation } from '../lib/types';
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
export const locationsWS = defaultWS<Location>('locations', locationsDB.list);
export const organisationsWS = defaultWS<Organisation>('organisations', organisationsDB.list);
