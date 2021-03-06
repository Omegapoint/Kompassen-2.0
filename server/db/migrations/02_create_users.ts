import { Knex } from 'knex';
import { GENERATE_UUID, onUpdateTrigger } from '../utils';

const table = 'users';

export const up = async (knex: Knex): Promise<void> =>
  knex.schema
    .createTable(table, (t) => {
      t.uuid('id').primary().defaultTo(knex.raw(GENERATE_UUID));

      t.jsonb('notifications').notNullable();

      t.timestamps(true, true);
    })
    .then(() => knex.raw(onUpdateTrigger(table)));

export const down = async (knex: Knex): Promise<void> => knex.schema.dropTable(table);
