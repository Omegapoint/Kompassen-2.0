import { knexSnakeCaseMappers } from 'objection';

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
};

module.exports = knexConfig;
