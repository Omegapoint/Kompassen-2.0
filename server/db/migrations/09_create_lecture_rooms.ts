import { Knex } from 'knex';
import { GENERATE_UUID, onUpdateTrigger } from '../utils';

const table = 'lecture_rooms';

export const up = async (knex: Knex): Promise<void> =>
  knex.schema
    .createTable(table, (t) => {
      t.uuid('id').primary().defaultTo(knex.raw(GENERATE_UUID));

      t.uuid('room_id').notNullable().references('rooms.id').onDelete('CASCADE');
      t.uuid('lecture_id').notNullable().references('lectures.id').onDelete('CASCADE');

      t.timestamp('start_at').notNullable();
      t.timestamp('end_at').notNullable();
    })
    .then(() => knex.raw(onUpdateTrigger(table)));

export const down = async (knex: Knex): Promise<void> => knex.schema.dropTable(table);
