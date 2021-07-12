import { GENERATE_UUID, onUpdateTrigger } from '../utils';
import { Knex } from 'knex';

const table = 'lectures';

export const up = async (knex: Knex): Promise<void> =>
  knex.schema
    .createTable(table, (t) => {
      t.uuid('id').primary().defaultTo(knex.raw(GENERATE_UUID));

      t.text('lecturer');
      t.text('description').notNullable();
      t.text('location');
      t.uuid('eventID');
      t.integer('duration');
      t.text('title').notNullable();
      t.text('category');
      t.specificType('maxParticipants', 'smallint');
      t.text('requirements');
      t.text('preparations');
      t.specificType('tags', 'text ARRAY');

      t.timestamps(true, true);
      t.uuid('createdBy').notNullable();
      t.uuid('updatedBy').notNullable();
    })
    .then(() => knex.raw(onUpdateTrigger(table)));

export const down = async (knex: Knex): Promise<void> => knex.schema.dropTable(table);
