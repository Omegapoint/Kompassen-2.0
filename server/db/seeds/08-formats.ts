import { Knex } from 'knex';
import formats from '../dummy/format';

const table = 'formats';

export const seed = async (knex: Knex): Promise<void> =>
  knex(table)
    .del()
    .then(() => knex(table).insert(formats));
