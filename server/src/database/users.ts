import { logger } from '../config/config';
import db from '../lib/database';
import { snakeToCamel } from '../lib/lib';
import { IDParam, NewUser, UpdatedUser, User } from '../lib/types';

const SELECT_USER_BY_ID = `
    SELECT id, notifications, created_at, updated_at
    FROM users
    WHERE id = $1
`;

const INSERT_USER = `
    INSERT INTO users(id, notifications)
    VALUES ($1, $2)
    RETURNING id
`;

const UPDATE_USER = `
    UPDATE users
    SET notifications = $1
    WHERE id = $2
    RETURNING id
`;

interface UserDB {
  getByID: (id: string) => Promise<User | null>;
  insert: (user: NewUser, id: string) => Promise<IDParam>;
  update: (user: UpdatedUser, id: string) => Promise<IDParam>;
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

  async insert(user, id): Promise<IDParam> {
    const { rows } = await db.query(INSERT_USER, [id, user.notifications]);
    return rows[0];
  },

  async update(user, id): Promise<IDParam> {
    const { rows } = await db.query(UPDATE_USER, [user.notifications, id]);
    return rows[0];
  },
};

export default usersDB;
