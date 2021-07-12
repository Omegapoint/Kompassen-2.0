import { GENERATE_UUID, onUpdateTrigger } from '../utils';
import { Knex } from 'knex';

const table = 'events';

export const up = async (knex: Knex): Promise<void> =>
  knex.schema
    .createTable(table, (t) => {
      t.uuid('id').primary().defaultTo(knex.raw(GENERATE_UUID));

      t.text('location').notNullable();
      t.timestamp('startAt').notNullable();
      t.timestamp('endAt').notNullable();

      t.timestamps(true, true);
      t.uuid('createdBy').notNullable();
      t.uuid('updatedBy').notNullable();
    })
    .then(() => knex.raw(onUpdateTrigger(table)));

export const down = async (knex: Knex): Promise<void> => knex.schema.dropTable(table);
