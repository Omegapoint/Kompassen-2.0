import { Knex } from 'knex';

export const up = async (knex: Knex): Promise<void> =>
  knex.schema
    .table('users', (t) => {
      t.text('speaker_bio');
      t.uuid('office_id');
    })
    .then(() =>
      knex.schema.alterTable('users', (t) => {
        t.text('speaker_bio').nullable().alter();
        t.uuid('office_id').references('offices.id').nullable().alter();
      })
    );

export const down = async (knex: Knex): Promise<void> =>
  knex.schema.table('users', (t) => {
    t.dropColumn('speaker_bio');
    t.dropColumn('office_id');
  });
