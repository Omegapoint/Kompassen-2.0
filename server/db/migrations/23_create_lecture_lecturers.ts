import { Knex } from 'knex';
import { GENERATE_UUID, onUpdateTrigger } from '../utils';

const table = 'lecture_lecturers';

export const up = async (knex: Knex): Promise<void> =>
  knex.schema
    .createTable(table, (t) => {
      t.uuid('id').primary().defaultTo(knex.raw(GENERATE_UUID));
      t.uuid('lecture_id').references('lectures.id').onDelete('CASCADE').notNullable();
      t.uuid('user_id').notNullable();
      t.timestamps(true, true);
      t.uuid('createdBy').notNullable();
      t.uuid('updatedBy').notNullable();
    })
    .then(() => knex.raw(onUpdateTrigger(table)));

export const down = async (knex: Knex): Promise<void> => knex.schema.dropTable(table);
