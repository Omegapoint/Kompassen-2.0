import { GENERATE_UUID, onUpdateTrigger } from '../utils';
import { Knex } from 'knex';

const table = 'categories';

export const up = async (knex: Knex): Promise<void> =>
  knex.schema
    .createTable(table, (t) => {
      t.uuid('id').primary().defaultTo(knex.raw(GENERATE_UUID));

      t.text('name').notNullable();
      t.text('icon').notNullable();
      t.text('color').notNullable();

      t.timestamps(true, true);
      t.uuid('createdBy').notNullable();
      t.uuid('updatedBy').notNullable();
    })
    .then(() => knex.raw(onUpdateTrigger(table)));

export const down = async (knex: Knex): Promise<void> => knex.schema.dropTable(table);
