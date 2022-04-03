import { logger } from '../config/config';
import db from '../lib/database';
import { snakeToCamel } from '../lib/lib';
import { IDParam, LectureLecturer, NewLectureLecturer } from '../lib/types';

const SELECT_LECTURELECTURERS = `
    SELECT id, 
    lecture_id, 
    user_id,
    first_time_presenting,
    created_at,
    updated_at,
    created_by,
    updated_by
    FROM lecture_lecturers
`;
const SELECT_LECTURELECTURER_BY_ID = `
    ${SELECT_LECTURELECTURERS}
    WHERE id = $1
`;

const SELECT_LECTURELECTURER_BY_LECTUREID = `
    ${SELECT_LECTURELECTURERS}
    WHERE lecture_id = $1
`;

const SELECT_LECTURELECTURER_BY_USERID_AND_LECTUREID = `
  ${SELECT_LECTURELECTURERS}
    WHERE user_id = $1 AND lecture_id = $2
`;

const INSERT_LECTURELECTURER = `
    INSERT INTO lecture_lecturers(lecture_id, user_id, first_time_presenting, created_by, updated_by)
    VALUES ($1, $2, $3, $4, $4)
    RETURNING id
`;

interface LectureLecturersDb {
  list: () => Promise<LectureLecturer[]>;
  getByID: (id: string) => Promise<LectureLecturer | null>;
  getByLectureID: (id: string) => Promise<LectureLecturer[] | null>;
  getByUserIDAndLectureID: (userID: string, lectureID: string) => Promise<LectureLecturer | null>;
  insert: (lectureLecturer: NewLectureLecturer, id: string) => Promise<IDParam>;
}

const lectureLecturersDb: LectureLecturersDb = {
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
  async getByLectureID(id) {
    const { rows } = await db.query(SELECT_LECTURELECTURER_BY_LECTUREID, [id]);
    return snakeToCamel(rows) || [];
  },
  async getByUserIDAndLectureID(userID, lectureID) {
    const { rows } = await db.query(SELECT_LECTURELECTURER_BY_USERID_AND_LECTUREID, [
      userID,
      lectureID,
    ]);
    if (!rows[0]) {
      logger.error(
        `could not find lecture lecturer with userId = '${userID} and lectureId = '${lectureID}'`
      );
      return null;
    }
    return snakeToCamel(rows[0]);
  },
  async insert(lectureLecturer, userId): Promise<IDParam> {
    const { rows } = await db.query(INSERT_LECTURELECTURER, [
      lectureLecturer.lectureID,
      lectureLecturer.userID,
      lectureLecturer.firstTimePresenting,
      userId,
    ]);
    return rows[0];
  },
};

export default lectureLecturersDb;
