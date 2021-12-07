import { subDays } from 'date-fns';
import { Knex } from 'knex';

export const up = async (knex: Knex): Promise<void> =>
  knex.schema
    .table('events', (t) => {
      t.timestamp('registration_start');
      t.timestamp('registration_end');
    })
    .then(() => {
      const d = new Date();
      knex('events').update({
        registrationStart: subDays(d, 2),
        registrationEnd: subDays(d, 1),
      });
    })
    .then(() =>
      knex.schema.alterTable('events', (t) => {
        t.timestamp('registration_start').notNullable().alter();
        t.timestamp('registration_end').notNullable().alter();
      })
    );

export const down = async (knex: Knex): Promise<void> =>
  knex.schema.table('events', (t) => {
    t.dropColumn('registration_start');
    t.dropColumn('registration_end');
  });
