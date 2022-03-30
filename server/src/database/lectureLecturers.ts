import { Format } from 'logform';
import { logger } from '../config/config';
import db from '../lib/database';
import { snakeToCamel } from '../lib/lib';

const SELECT_LECTURELECTURERS = `
    SELECT id, 
    lecture_id, 
    user_id,
    created_at,
    updated_at,
    created_by,
    updated_by
    FROM lecture_lecturers
`;
const SELECT_LECTURELECTURER_BY_ID = `
    SELECT id, lecture_id, user_id
    FROM lecture_lecturers
    WHERE id = $1
`;

interface LectureLecturerDb {
  list: () => Promise<Format[]>;
  getByID: (id: string) => Promise<Format | null>;
}

const lectureLecturerDb: LectureLecturerDb = {
  async list() {
    const { rows } = await db.query(SELECT_LECTURELECTURERS);
    return snakeToCamel(rows) || [];
  },
  async getByID(id) {
    const { rows } = await db.query(SELECT_LECTURELECTURER_BY_ID, [id]);
    if (!rows[0]) {
      logger.error(`could not find lecture lecturer with id = '${id}'`);
      return null;
    }
    return snakeToCamel(rows[0]);
  },
};

export default lectureLecturerDb;
