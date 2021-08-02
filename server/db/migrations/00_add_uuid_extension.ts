import { Knex } from 'knex';

export const up = async (knex: Knex): Promise<void> =>
  knex.raw(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);

export const down = async (knex: Knex): Promise<void> => knex.raw(`DROP EXTENSION "uuid-ossp"`);
