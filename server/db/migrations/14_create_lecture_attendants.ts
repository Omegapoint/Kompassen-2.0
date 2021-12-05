import { Knex } from 'knex';
import { onUpdateTrigger } from '../utils';

const table = 'lecture_attendants';

export const up = async (knex: Knex): Promise<void> =>
  knex.schema
    .createTable(table, (t) => {
      t.uuid('attendant_id').references('attendants.id').notNullable().onDelete('CASCADE');
      t.uuid('lecture_id').references('lectures.id').notNullable().onDelete('CASCADE');
    })
    .then(() => knex.raw(onUpdateTrigger(table)));

export const down = async (knex: Knex): Promise<void> => knex.schema.dropTable(table);
