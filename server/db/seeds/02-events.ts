import { Knex } from 'knex';
import events from '../dummy/events';

const table = 'events';

export const seed = async (knex: Knex): Promise<void> =>
  knex(table)
    .del()
    .then(() => knex(table).insert(events));
