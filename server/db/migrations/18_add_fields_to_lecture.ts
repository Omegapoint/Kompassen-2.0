import { Knex } from 'knex';

export const up = async (knex: Knex): Promise<void> =>
  knex.schema
    .table('lectures', (t) => {
      t.text('video_link');
      t.text('key_takeaway');
    })
    .then(() =>
      knex.schema.alterTable('lectures', (t) => {
        t.text('video_link').nullable().alter();
        t.text('key_takeaway').nullable().alter();
      })
    );

export const down = async (knex: Knex): Promise<void> =>
  knex.schema.table('events', (t) => {
    t.dropColumn('video_link');
    t.dropColumn('key_takeaway');
  });
