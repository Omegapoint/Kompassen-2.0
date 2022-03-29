import { Format } from 'logform';
import { logger } from '../config/config';
import db from '../lib/database';
import { snakeToCamel } from '../lib/lib';
import { IDParam, NewFormat, UpdatedFormat } from '../lib/types';

const SELECT_FORMATS = `
    SELECT id, 
    name, 
    info, 
    archived,
    created_at,
    updated_at,
    created_by,
    updated_by
    FROM formats
`;

const SELECT_FORMATS_BY_ID = `
    SELECT id, name, info
    FROM offices
    WHERE id = $1
`;

const INSERT_FORMAT = `
    INSERT INTO formats(name, info, created_by, updated_by)
    VALUES ($1, $2, $3, $3)
    RETURNING id
`;

const UPDATE_FORMAT = `
    UPDATE formats
    SET name = $1,
        info = $2,
        updated_by = $3
    WHERE id = $4
    RETURNING id
`;

interface FormatDb {
  list: () => Promise<Format[]>;
  getByID: (id: string) => Promise<Format | null>;
  insert: (format: NewFormat, id: string) => Promise<IDParam>;
  update: (format: UpdatedFormat, id: string) => Promise<IDParam>;
}

const formatDb: FormatDb = {
  async list() {
    const { rows } = await db.query(SELECT_FORMATS);
    return snakeToCamel(rows) || [];
  },
  async getByID(id) {
    const { rows } = await db.query(SELECT_FORMATS_BY_ID, [id]);
    if (!rows[0]) {
      logger.error(`could not find format with id = '${id}'`);
      return null;
    }
    return snakeToCamel(rows[0]);
  },

  async insert(format, userId): Promise<IDParam> {
    const { rows } = await db.query(INSERT_FORMAT, [format.name, format.info, userId]);
    return rows[0];
  },

  async update(format, userID): Promise<IDParam> {
    const { rows } = await db.query(UPDATE_FORMAT, [format.name, format.info, userID, format.id]);
    return rows[0];
  },
};

export default formatDb;
