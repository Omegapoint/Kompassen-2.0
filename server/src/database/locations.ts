import { logger } from '../config/config';
import db from '../lib/database';
import { snakeToCamel } from '../lib/lib';
import { IDParam, Location, NewLocation, UpdatedLocation } from '../lib/types';

const SELECT_LOCATIONS = `
    SELECT l.id, l.name, l.created_at, l.updated_at, u1.name as created_by, u2.name as updated_by
    FROM locations l
             LEFT JOIN users u1 on l.created_by = u1.id
             LEFT JOIN users u2 on l.updated_by = u2.id
`;

const SELECT_LOCATION_BY_ID = `
    ${SELECT_LOCATIONS}
    WHERE l.id = $1
`;

const INSERT_LOCATION = `
    INSERT INTO locations(name, created_by, updated_by)
    VALUES ($1, $2, $2)
    RETURNING id
`;

const UPDATE_LOCATION = `
    UPDATE locations
    SET name       = $1,
        updated_by = $2
    WHERE id = $3
    RETURNING id
`;

const DELETE_LOCATION = `
    DELETE
    FROM locations
    WHERE id = $1
    RETURNING id
`;

interface LocationsDB {
  list: () => Promise<Location[]>;
  getByID: (id: string) => Promise<Location | null>;
  insert: (location: NewLocation, id: string) => Promise<IDParam>;
  update: (location: UpdatedLocation, id: string) => Promise<IDParam>;
  delete: (id: string) => Promise<IDParam>;
}

const locationsDB: LocationsDB = {
  async list() {
    const { rows } = await db.query(SELECT_LOCATIONS);
    return snakeToCamel(rows) || [];
  },

  async getByID(id) {
    const { rows } = await db.query(SELECT_LOCATION_BY_ID, [id]);
    if (!rows[0]) {
      logger.error(`could not find location with id = '${id}'`);
      return null;
    }
    return snakeToCamel(rows[0]);
  },

  async insert(location, userID): Promise<IDParam> {
    const { rows } = await db.query(INSERT_LOCATION, [location.name, userID]);
    return rows[0];
  },

  async update(location, userID): Promise<IDParam> {
    const { rows } = await db.query(UPDATE_LOCATION, [location.name, userID, location.id]);
    return rows[0];
  },

  async delete(id): Promise<IDParam> {
    const { rows } = await db.query(DELETE_LOCATION, [id]);
    return rows[0];
  },
};

export default locationsDB;
