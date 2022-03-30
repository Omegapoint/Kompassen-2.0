import { logger } from '../config/config';
import db from '../lib/database';
import { snakeToCamel } from '../lib/lib';
import { LectureStatus } from '../lib/types';

const SELECT_LECTURESTATUS = `
    SELECT id, 
    lecture_id, 
    status_id,
    created_at,
    updated_at,
    created_by,
    updated_by
    FROM lecture_status
`;
const SELECT_LECTURESTATUS_BY_ID = `
    SELECT id, lecture_id, status_id
    FROM lecture_status
    WHERE id = $1
`;

interface LectureStatusDb {
  list: () => Promise<LectureStatus[]>;
  getByID: (id: string) => Promise<LectureStatus | null>;
}

const lectureStatusDb: LectureStatusDb = {
  async list() {
    const { rows } = await db.query(SELECT_LECTURESTATUS);
    return snakeToCamel(rows) || [];
  },
  async getByID(id) {
    const { rows } = await db.query(SELECT_LECTURESTATUS_BY_ID, [id]);
    if (!rows[0]) {
      logger.error(`could not find lecture status with id = '${id}'`);
      return null;
    }
    return snakeToCamel(rows[0]);
  },
};

export default lectureStatusDb;
