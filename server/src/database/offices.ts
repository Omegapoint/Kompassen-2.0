import { logger } from '../config/config';
import db from '../lib/database';
import { snakeToCamel } from '../lib/lib';
import { IDParam, NewOffice, Office, UpdatedOffice } from '../lib/types';

const SELECT_OFFICES = `
    SELECT id, 
    name,  
    created_at,
    created_by,
    updated_at,
    updated_by
    FROM offices
`;

const SELECT_OFFICE_BY_ID = `
    SELECT id, name
    FROM offices
    WHERE id = $1
`;

const INSERT_OFFICE = `
    INSERT INTO offices(name, created_by, updated_by)
    VALUES ($1, $2)
    RETURNING id
`;

const UPDATE_OFFICE = `
    UPDATE offices
    SET name = $1
        updated_by = $2
    WHERE id = $3
    RETURNING id
`;

interface OfficeDb {
  list: () => Promise<Office[]>;
  getByID: (id: string) => Promise<Office | null>;
  insert: (office: NewOffice, id: string) => Promise<IDParam>;
  update: (office: UpdatedOffice, id: string) => Promise<IDParam>;
}

const officeDb: OfficeDb = {
  async list() {
    const { rows } = await db.query(SELECT_OFFICES);
    return snakeToCamel(rows) || [];
  },
  async getByID(id) {
    const { rows } = await db.query(SELECT_OFFICE_BY_ID, [id]);
    if (!rows[0]) {
      logger.error(`could not find office with id = '${id}'`);
      return null;
    }
    return snakeToCamel(rows[0]);
  },

  async insert(office, userId): Promise<IDParam> {
    const { rows } = await db.query(INSERT_OFFICE, [office.name, userId]);
    return rows[0];
  },

  async update(office, userID): Promise<IDParam> {
    const { rows } = await db.query(UPDATE_OFFICE, [office.name, userID, office.id]);
    return rows[0];
  },
};

export default officeDb;
