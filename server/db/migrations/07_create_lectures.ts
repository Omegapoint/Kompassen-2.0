import { Knex } from 'knex';
import { GENERATE_UUID, onUpdateTrigger } from '../utils';

const table = 'lectures';

export const up = async (knex: Knex): Promise<void> =>
  knex.schema
    .createTable(table, (t) => {
      t.uuid('id').primary().defaultTo(knex.raw(GENERATE_UUID));

      t.text('lecturer');
      t.uuid('lecturer_id');
      t.text('description').notNullable();
      t.uuid('location_id').references('locations.id');
      t.boolean('remote');
      t.uuid('event_id').references('events.id');
      t.integer('duration');
      t.text('title').notNullable();
      t.uuid('category_id').references('categories.id');
      t.specificType('maxParticipants', 'smallint');
      t.text('requirements');
      t.text('preparations');
      t.text('message');
      t.specificType('tags', 'text ARRAY');
      t.boolean('idea').notNullable();
      t.boolean('draft').notNullable();
      t.boolean('approved').notNullable();
      t.timestamps(true, true);
      t.uuid('createdBy').notNullable();
      t.uuid('updatedBy').notNullable();
    })
    .then(() => knex.raw(onUpdateTrigger(table)));

export const down = async (knex: Knex): Promise<void> => knex.schema.dropTable(table);
