import { Knex } from 'knex';

export const up = async (knex: Knex): Promise<void> =>
  knex.schema
    .table('lectures', (t) => {
      t.uuid('format_id');
      t.uuid('status_id');
      t.text('video_link');
      t.text('key_takeaway');
      t.boolean('internal_presentation');
      t.boolean('first_time_presenting');
      t.text('target_audience');
    })
    .then(() =>
      knex.schema.alterTable('lectures', (t) => {
        t.uuid('format_id').nullable().alter();
        t.uuid('status_id').nullable().alter();
        t.text('video_link').nullable().alter();
        t.text('key_takeaway').nullable().alter();
        t.boolean('internal_presentation').nullable().alter();
        t.boolean('first_time_presenting').nullable().alter();
        t.text('target_audience').nullable().alter();
      })
    );

export const down = async (knex: Knex): Promise<void> =>
  knex.schema.table('lectures', (t) => {
    t.dropColumn('format_id');
    t.dropColumn('status_id');
    t.dropColumn('video_link');
    t.dropColumn('key_takeaway');
    t.dropColumn('internal_presentation');
    t.dropColumn('first_time_presenting');
    t.dropColumn('target_audience');
  });
