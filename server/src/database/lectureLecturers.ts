import { logger } from '../config/config';
import db from '../lib/database';
import { snakeToCamel } from '../lib/lib';
import { IDParam, LectureLecturer, NewLectureLecturer } from '../lib/types';

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

const INSERT_LECTURELECTURER = `
    INSERT INTO lecture_lecturers(lecture_id, user_id, created_by, updated_by)
    VALUES ($1, $2, $3, $3)
    RETURNING id
`;

interface LectureLecturerDb {
  list: () => Promise<LectureLecturer[]>;
  getByID: (id: string) => Promise<LectureLecturer | null>;
  insert: (lectureLecturer: NewLectureLecturer, id: string) => Promise<IDParam>;
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
  async insert(lectureLecturer, userId): Promise<IDParam> {
    const { rows } = await db.query(INSERT_LECTURELECTURER, [
      lectureLecturer.lectureID,
      lectureLecturer.userID,
      userId,
    ]);
    return rows[0];
  },
};

export default lectureLecturerDb;
