import db from '../lib/database';
import { logger } from '../config/config';
import { User, IDParam, NewUser, UpdatedUser } from '../lib/types';
import { snakeToCamel } from '../lib/lib';

const SELECT_USER_BY_ID = `
    SELECT id, name, notifications, created_at, updated_at
    FROM users
    WHERE id = $1
`;

const INSERT_USER = `
    INSERT INTO users(id, name, notifications)
    VALUES ($1, $2, $3)
    RETURNING id
`;

const UPDATE_USER = `
    UPDATE users
    SET name          = $1,
        notifications = $2
    WHERE id = $3
    RETURNING id
`;

interface UserDB {
  getByID: (id: string) => Promise<User | null>;
  insert: (user: NewUser, id: string, name: string) => Promise<IDParam>;
  update: (user: UpdatedUser, id: string, name: string) => Promise<IDParam>;
}

const usersDB: UserDB = {
  async getByID(id) {
    const { rows } = await db.query(SELECT_USER_BY_ID, [id]);
    if (!rows[0]) {
      logger.error(`could not find user with id = '${id}'`);
      return null;
    }
    return snakeToCamel(rows[0]);
  },

  async insert(user, id, name): Promise<IDParam> {
    const { rows } = await db.query(INSERT_USER, [id, name, user.notifications]);
    return rows[0];
  },

  async update(user, id, name): Promise<IDParam> {
    const { rows } = await db.query(UPDATE_USER, [name, user.notifications, id]);
    return rows[0];
  },
};

export default usersDB;
