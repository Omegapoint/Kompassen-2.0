import db from '../lib/database';
import { logger } from '../config/config';
import { IDParam, Category, NewCategory, UpdatedCategory } from '../lib/types';
import { snakeToCamel } from '../lib/lib';

const SELECT_CATEGORIES = `
    SELECT l.id,
           l.name,
           l.icon,
           l.created_at,
           l.updated_at,
           u1.name as created_by,
           u2.name as updated_by
    FROM categories l
             LEFT JOIN users u1 on l.created_by = u1.id
             LEFT JOIN users u2 on l.updated_by = u2.id
`;

const SELECT_CATEGORY_BY_ID = `
    ${SELECT_CATEGORIES}
    WHERE l.id = $1
`;

const INSERT_CATEGORY = `
    INSERT INTO categories(name, icon, created_by, updated_by)
    VALUES ($1, $2, $3, $3)
    RETURNING id
`;

const UPDATE_CATEGORY = `
    UPDATE categories
    SET name       = $1,
        icon       = $2,
        updated_by = $3
    WHERE id = $4
    RETURNING id
`;

const DELETE_CATEGORY = `
    DELETE
    FROM categories
    WHERE id = $1
    RETURNING id
`;

interface CategoriesDB {
  list: () => Promise<Category[]>;
  getByID: (id: string) => Promise<Category | null>;
  insert: (category: NewCategory, id: string) => Promise<IDParam>;
  update: (category: UpdatedCategory, id: string) => Promise<IDParam>;
  delete: (id: string) => Promise<IDParam>;
}

const categoriesDB: CategoriesDB = {
  async list() {
    const { rows } = await db.query(SELECT_CATEGORIES);
    return snakeToCamel(rows) || [];
  },

  async getByID(id) {
    const { rows } = await db.query(SELECT_CATEGORY_BY_ID, [id]);
    if (!rows[0]) {
      logger.error(`could not find category with id = '${id}'`);
      return null;
    }
    return snakeToCamel(rows[0]);
  },

  async insert(category, userID): Promise<IDParam> {
    const { rows } = await db.query(INSERT_CATEGORY, [category.name, category.icon, userID]);
    return rows[0];
  },

  async update(category, userID): Promise<IDParam> {
    const { rows } = await db.query(UPDATE_CATEGORY, [
      category.name,
      category.icon,
      userID,
      category.id,
    ]);
    return rows[0];
  },

  async delete(id): Promise<IDParam> {
    const { rows } = await db.query(DELETE_CATEGORY, [id]);
    return rows[0];
  },
};

export default categoriesDB;