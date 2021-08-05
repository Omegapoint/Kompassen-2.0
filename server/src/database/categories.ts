import { logger } from '../config/config';
import db from '../lib/database';
import { snakeToCamel } from '../lib/lib';
import { Category, IDParam, NewCategory, UpdatedCategory } from '../lib/types';

const SELECT_CATEGORIES = `
    SELECT id,
           name,
           icon,
           color,
           created_at,
           created_by,
           updated_at,
           updated_by
    FROM categories
`;

const SELECT_CATEGORY_BY_ID = `
    ${SELECT_CATEGORIES}
    WHERE id = $1
`;

const INSERT_CATEGORY = `
    INSERT INTO categories(name, icon, color, created_by, updated_by)
    VALUES ($1, $2, $3, $4, $4)
    RETURNING id
`;

const UPDATE_CATEGORY = `
    UPDATE categories
    SET name       = $1,
        icon       = $2,
        color      = $3,
        updated_by = $4
    WHERE id = $5
    RETURNING id
`;

const DELETE_CATEGORY = `
    UPDATE categories
    SET archived = true
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
    const { rows } = await db.query(INSERT_CATEGORY, [
      category.name,
      category.icon,
      category.color,
      userID,
    ]);
    return rows[0];
  },

  async update(category, userID): Promise<IDParam> {
    const { rows } = await db.query(UPDATE_CATEGORY, [
      category.name,
      category.icon,
      category.color,
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
