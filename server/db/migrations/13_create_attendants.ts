import { Knex } from 'knex';
import { GENERATE_UUID, onUpdateTrigger } from '../utils';

const table = 'attendants';

export const up = async (knex: Knex): Promise<void> =>
  knex.schema
    .createTable(table, (t) => {
      t.uuid('id').primary().defaultTo(knex.raw(GENERATE_UUID));
      t.uuid('user_id').references('users.id').notNullable().onDelete('CASCADE');
      t.uuid('event_id').references('events.id').notNullable().onDelete('CASCADE');
      t.text('message').notNullable();
      t.boolean('remote').notNullable();
      t.timestamps(true, true);
      t.uuid('createdBy').notNullable();
      t.uuid('updatedBy').notNullable();
    })
    .then(() => knex.raw(onUpdateTrigger(table)));

export const down = async (knex: Knex): Promise<void> => knex.schema.dropTable(table);
