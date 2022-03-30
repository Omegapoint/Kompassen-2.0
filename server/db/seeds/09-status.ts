import { Knex } from 'knex';
import status from '../dummy/status';

const table = 'status';

export const seed = async (knex: Knex): Promise<void> =>
  knex(table)
    .del()
    .then(() => knex(table).insert(status));
