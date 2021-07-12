import { Pool } from 'pg';
import config from '../config/config';
import { knexSnakeCaseMappers } from 'objection';
import Knex from 'knex';

export const knex = Knex({
  client: 'pg',
  version: '13.0',
  connection: config.postgres,
  pool: {
    min: 2,
    max: 7,
    idleTimeoutMillis: 20 * 1000,
  },
  ...knexSnakeCaseMappers(),
});

const db = new Pool({
  connectionString: config.postgresUrl,
});

export default db;
