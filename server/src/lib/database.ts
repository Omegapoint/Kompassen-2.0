/* eslint-disable import/no-extraneous-dependencies */

import { Pool } from 'pg';
import config from '../config/config';

const db = new Pool({
  ...config.postgres,
});

db.connect();

export default db;
