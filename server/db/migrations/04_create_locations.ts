import { Knex } from 'knex';
import { GENERATE_UUID, onUpdateTrigger } from '../utils';

const table = 'locations';

export const up = async (knex: Knex): Promise<void> =>
  knex.schema
    .createTable(table, (t) => {
      t.uuid('id').primary().defaultTo(knex.raw(GENERATE_UUID));

      t.text('name').notNullable();

      t.boolean('archived').notNullable().defaultTo(false);
      t.timestamps(true, true);
      t.uuid('createdBy').notNullable();
      t.uuid('updatedBy').notNullable();
    })
    .then(() => knex.raw(onUpdateTrigger(table)));

export const down = async (knex: Knex): Promise<void> => knex.schema.dropTable(table);
