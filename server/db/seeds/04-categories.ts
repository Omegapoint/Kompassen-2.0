import { Knex } from 'knex';
import categories from '../dummy/categories';

const table = 'categories';

export const seed = async (knex: Knex): Promise<void> =>
  knex(table)
    .del()
    .then(() => knex(table).insert(categories));
