import { Knex } from 'knex';
import organisations from '../dummy/organisations';

const table = 'organisations';

export const seed = async (knex: Knex): Promise<void> =>
  knex(table)
    .del()
    .then(() => knex(table).insert(organisations));
