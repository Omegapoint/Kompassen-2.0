import { Knex } from 'knex';

const CREATE_ON_UPDATE_TIMESTAMP_FUNCTION = `
  CREATE OR REPLACE FUNCTION on_update_timestamp()
  RETURNS trigger AS $$
  BEGIN
    NEW.updated_at = now();
    RETURN NEW;
  END;
  $$ language 'plpgsql';
`;

const DELETE_ON_UPDATE_TIMESTAMP_FUNCTION = `
  DROP FUNCTION on_update_timestamp()
`;

export const up = async (knex: Knex): Promise<void> =>
  knex.raw(CREATE_ON_UPDATE_TIMESTAMP_FUNCTION);

export const down = async (knex: Knex): Promise<void> =>
  knex.raw(DELETE_ON_UPDATE_TIMESTAMP_FUNCTION);
