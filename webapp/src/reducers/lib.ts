import { IDParam } from '../lib/Types';

export function updateListItem<T extends IDParam>(li: T[], payload: T): T[] {
  return li.map((e) => (e.id === payload.id ? payload : e));
}

export function deleteListItem<T extends IDParam>(li: T[], payload: T): T[] {
  return li.filter((e) => e.id !== payload.id);
}

export function createListItem<T extends IDParam>(li: T[], payload: T): T[] {
  return [...li, payload];
}
