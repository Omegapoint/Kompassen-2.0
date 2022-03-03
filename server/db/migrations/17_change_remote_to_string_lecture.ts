import { Knex } from 'knex';

export const up = async (knex: Knex): Promise<void> =>
  knex.schema.alterTable('lectures', (t) => {
    t.text('remote').alter();
  });

export const down = async (knex: Knex): Promise<void> =>
  knex.schema.table('lectures', (t) => {
    t.boolean('remote').alter();
  });
