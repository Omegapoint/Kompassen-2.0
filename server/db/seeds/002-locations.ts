import { Knex } from 'knex';
import locations from '../dummy/locations';

const table = 'locations';

export const seed = async (knex: Knex): Promise<void> =>
  knex(table)
    .del()
    .then(() => knex(table).insert(locations));
