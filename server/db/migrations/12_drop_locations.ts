import { Knex } from 'knex';
import { up as upLocations } from './04_create_locations';

export const up = async (knex: Knex): Promise<void> =>
  knex.schema
    .table('lectures', (t) => {
      t.dropColumn('location_id');
    })
    .then(() => knex.schema.dropTable('locations'));

export const down = async (knex: Knex): Promise<void> => upLocations(knex);
