import { Knex } from 'knex';

export const up = async (knex: Knex): Promise<void> =>
  knex.schema
    .table('lectures', (t) => {
      t.text('key_takeaway');
      t.text('video_link');
      t.boolean('internal_presentation');
      t.boolean('first_time_presenting');
      t.text('target_audience');
      t.uuid('format_id');
      t.uuid('lecture_status_id');
    })
    .then(() =>
      knex.schema.alterTable('lectures', (t) => {
        t.text('key_takeaway').nullable().alter();
        t.text('video_link').nullable().alter();
        t.boolean('internal_presentation').nullable().alter();
        t.boolean('first_time_presenting').nullable().alter();
        t.text('target_audience').nullable().alter();
        t.uuid('format_id').references('formats.id').nullable().alter();
        t.uuid('lecture_status_id').references('lecture_status.id').nullable().alter();
      })
    );

export const down = async (knex: Knex): Promise<void> =>
  knex.schema.table('lectures', (t) => {
    t.dropColumn('key_takeaway');
    t.dropColumn('video_link');
    t.dropColumn('internal_presentation');
    t.dropColumn('first_time_presenting');
    t.dropColumn('target_audience');
    t.dropColumn('format_id');
    t.dropColumn('lecture_status_id');
  });
