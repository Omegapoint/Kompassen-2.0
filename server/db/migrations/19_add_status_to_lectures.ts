import { Knex } from 'knex';

export const up = async (knex: Knex): Promise<void> =>
  knex.schema
    .table('lectures', (t) => {
      t.text('status');
    })
    .then(() =>
      knex.schema.alterTable('lectures', (t) => {
        t.enu('status', ['Unhandled', 'Denied', 'Accepted', 'Feedback'], {
          useNative: true,
          enumName: 'lecture_status',
        })
          .nullable()
          .alter();
      })
    );

export const down = async (knex: Knex): Promise<void> =>
  knex.schema
    .table('lectures', (t) => {
      t.dropColumn('status');
    })
    .then(() => knex.schema.dropTable('lecture_status'));
