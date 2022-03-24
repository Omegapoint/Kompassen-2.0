import { Knex } from 'knex';

export const up = async (knex: Knex): Promise<void> =>
  knex.schema
    .table('lectures', (t) => {
      t.text('type');
    })
    .then(() =>
      knex.schema.alterTable('lectures', (t) => {
        t.text('type').nullable().alter();
      })
    );

export const down = async (knex: Knex): Promise<void> =>
  knex.schema.table('lectures', (t) => {
    t.dropColumn('type');
  });

//'Unhandled', 'Denied', 'Accepted', 'Feedback'
