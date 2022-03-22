import { Knex } from 'knex';
import offices from '../dummy/offices';

const table = 'offices';

export const seed = async (knex: Knex): Promise<void> =>
  knex(table)
    .del()
    .then(() => knex(table).insert(offices));
