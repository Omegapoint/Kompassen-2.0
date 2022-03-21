import { Knex } from 'knex';

export const up = async (knex: Knex): Promise<void> =>
  knex.schema
    .table('users', (t) => {
      t.text('profile_picture_link');
      t.text('speaker_bio');
      t.uuid('office_id');
    })
    .then(() =>
      knex.schema.alterTable('users', (t) => {
        t.text('profile_picture_link').nullable().alter();
        t.text('speaker_bio').nullable().alter();
        t.uuid('office_id').nullable().alter();
      })
    );

export const down = async (knex: Knex): Promise<void> =>
  knex.schema.table('users', (t) => {
    t.dropColumn('profile_picture_link');
    t.dropColumn('speaker_bio');
    t.uuid('office_id');
  });
