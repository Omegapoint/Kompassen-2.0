import { Knex } from 'knex';
import { GENERATE_UUID, onUpdateTrigger } from '../utils';

const table = 'lecture_feedback';

export const up = async (knex: Knex): Promise<void> =>
  knex.schema
    .createTable(table, (t) => {
      t.uuid('id').primary().defaultTo(knex.raw(GENERATE_UUID));

      t.uuid('lectureID').notNullable().references('lectures.id').onDelete('CASCADE');
      t.uuid('userID').notNullable().references('users.id');

      t.text('message').notNullable();

      t.timestamps(true, true);
    })
    .then(() => knex.raw(onUpdateTrigger(table)));

export const down = async (knex: Knex): Promise<void> => knex.schema.dropTable(table);
