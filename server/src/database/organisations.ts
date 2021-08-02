import { logger } from '../config/config';
import db from '../lib/database';
import { snakeToCamel } from '../lib/lib';
import { IDParam, NewOrganisation, Organisation, UpdatedOrganisation } from '../lib/types';

const SELECT_ORGANISATIONS = `
    SELECT id,
           name,
           archived,
           created_at,
           created_by,
           updated_at,
           updated_by
    FROM organisations
`;

const SELECT_ORGANISATION_BY_ID = `
    ${SELECT_ORGANISATIONS}
    WHERE id = $1
`;

const INSERT_ORGANISATION = `
    INSERT INTO organisations(name, created_by, updated_by)
    VALUES ($1, $2, $2)
    RETURNING id
`;

const UPDATE_ORGANISATION = `
    UPDATE organisations
    SET name       = $1,
        updated_by = $2
    WHERE id = $3
    RETURNING id
`;

const DELETE_ORGANISATION = `
    UPDATE organisations
    SET archived = true
    WHERE id = $1
    RETURNING id
`;

interface OrganisationsDB {
  list: () => Promise<Organisation[]>;
  getByID: (id: string) => Promise<Organisation | null>;
  insert: (organisation: NewOrganisation, id: string) => Promise<IDParam>;
  update: (organisation: UpdatedOrganisation, id: string) => Promise<IDParam>;
  delete: (id: string) => Promise<IDParam>;
}

const organisationsDB: OrganisationsDB = {
  async list() {
    const { rows } = await db.query(SELECT_ORGANISATIONS);
    return snakeToCamel(rows) || [];
  },

  async getByID(id) {
    const { rows } = await db.query(SELECT_ORGANISATION_BY_ID, [id]);
    if (!rows[0]) {
      logger.error(`could not find organisation with id = '${id}'`);
      return null;
    }
    return snakeToCamel(rows[0]);
  },

  async insert(organisation, userID): Promise<IDParam> {
    const { rows } = await db.query(INSERT_ORGANISATION, [organisation.name, userID]);
    return rows[0];
  },

  async update(organisation, userID): Promise<IDParam> {
    const { rows } = await db.query(UPDATE_ORGANISATION, [
      organisation.name,
      userID,
      organisation.id,
    ]);
    return rows[0];
  },

  async delete(id): Promise<IDParam> {
    const { rows } = await db.query(DELETE_ORGANISATION, [id]);
    return rows[0];
  },
};

export default organisationsDB;
