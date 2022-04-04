import { logger } from '../config/config';
import db from '../lib/database';
import { snakeToCamel } from '../lib/lib';
import { NewStatus, Status } from '../lib/types';

const SELECT_STATUS = `
    SELECT id, 
    name, 
    created_at,
    updated_at,
    created_by,
    updated_by
    FROM status
`;

const SELECT_STATUS_BY_ID = `
    SELECT id, name
    FROM status
    WHERE id = $1
`;

const INSERT_STATUS = `
    INSERT INTO status(name, created_by, updated_by)
    VALUES ($1, $2, $2)
    RETURNING id
`;

interface StatusDb {
  list: () => Promise<Status[]>;
  insert: (office: NewStatus, id: string) => Promise<IDParam>;
  getByID: (id: string) => Promise<Status | null>;
}

const statusDb: StatusDb = {
  async list() {
    const { rows } = await db.query(SELECT_STATUS);
    return snakeToCamel(rows) || [];
  },
  async getByID(id) {
    const { rows } = await db.query(SELECT_STATUS_BY_ID, [id]);
    if (!rows[0]) {
      logger.error(`could not find status with id = '${id}'`);
      return null;
    }
    return snakeToCamel(rows[0]);
  },
  async insert(status, userId): Promise<IDParam> {
    const { rows } = await db.query(INSERT_STATUS, [status.name, userId]);
    return rows[0];
  },
};

export default statusDb;
