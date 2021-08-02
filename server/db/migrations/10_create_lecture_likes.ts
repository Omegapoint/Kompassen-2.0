import { GENERATE_UUID, onUpdateTrigger } from '../utils';
import { Knex } from 'knex';

const table = 'lecture_likes';

export const up = async (knex: Knex): Promise<void> =>
  knex.schema
    .createTable(table, (t) => {
      t.uuid('id').primary().defaultTo(knex.raw(GENERATE_UUID));

      t.uuid('lectureID').notNullable().references('lectures.id').onDelete('CASCADE');
      t.uuid('userID').notNullable().references('users.id').onDelete('CASCADE');

      t.timestamp('createdAt').notNullable().defaultTo(knex.raw('now()'));
    })
    .then(() => knex.raw(onUpdateTrigger(table)));

export const down = async (knex: Knex): Promise<void> => knex.schema.dropTable(table);
