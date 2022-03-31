import { logger } from '../config/config';
import db from '../lib/database';
import { snakeToCamel } from '../lib/lib';
import { IDParam, LectureStatus, NewLectureStatus } from '../lib/types';

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

const INSERT_LECTURESTATUS = `
    INSERT INTO lecture_status(lecture_id, status_id, created_by, updated_by)
    VALUES ($1, $2, $3, $3)
    RETURNING id
`;

interface LectureStatusDb {
  list: () => Promise<LectureStatus[]>;
  getByID: (id: string) => Promise<LectureStatus | null>;
  insert: (lectureStatus: NewLectureStatus, id: string) => Promise<IDParam>;
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
  async insert(lectureStatus, userId): Promise<IDParam> {
    const { rows } = await db.query(INSERT_LECTURESTATUS, [
      lectureStatus.lecture_id,
      lectureStatus.status_id,
      userId,
    ]);
    return rows[0];
  },
};

export default lectureStatusDb;
