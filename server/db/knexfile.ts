import { knexSnakeCaseMappers } from 'objection';

const { PG_USERNAME, PG_PASSWORD, PG_HOST, PG_PORT, PG_DATABASE, PG_SSL } = process.env;

const defaultConf = {
  client: 'pg',
  version: '11.6',
  pool: {
    min: 2,
    max: 10,
    idleTimeoutMillis: 20 * 1000,
  },
  ...knexSnakeCaseMappers(),
};

const knexConfig = {
  development: {
    ...defaultConf,
    connection: {
      host: 'localhost',
      port: 15432,
      user: 'username',
      password: 'password',
      database: 'kompassen2',
    },
    migrations: {
      directory: './migrations',
    },
    seeds: {
      directory: './seeds',
    },
  },
  production: {
    ...defaultConf,
    connection: {
      host: PG_HOST || 'localhost',
      port: parseInt(PG_PORT || '0', 10) || 15432,
      user: PG_USERNAME || 'username',
      password: PG_PASSWORD || 'password',
      database: PG_DATABASE || 'kompassen2',
      ssl: !!parseInt(PG_SSL || '0', 10),
    },
    migrations: {
      directory: './migrations',
    },
  },
};

module.exports = knexConfig;
