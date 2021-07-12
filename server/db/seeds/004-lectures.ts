import { Knex } from 'knex';
import lectures from '../dummy/lectures';

const table = 'lectures';

export const seed = async (knex: Knex): Promise<void> =>
  knex(table)
    .del()
    .then(() => knex(table).insert(lectures));
