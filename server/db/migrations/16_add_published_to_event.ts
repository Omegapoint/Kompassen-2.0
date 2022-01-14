import { Knex } from 'knex';

export const up = async (knex: Knex): Promise<void> =>
  knex.schema
    .table('events', (t) => {
      t.boolean('published');
    })
    .then(() =>
      knex.schema.alterTable('events', (t) => {
        t.boolean('published').notNullable().defaultTo(false).alter();
      })
    );

export const down = async (knex: Knex): Promise<void> =>
  knex.schema.table('events', (t) => {
    t.dropColumn('published');
  });
