import db from '../lib/database';
import { IDParam, LectureMessage, NewDBLectureMessage } from '../lib/types';
import { snakeToCamel } from '../lib/lib';

const LIST_LECTURE_MESSAGES = `
    SELECT id, lecture_id, user_id, message, created_at, updated_at
    FROM lecture_messages
    WHERE lecture_id = $1
    ORDER BY created_at
`;

const INSERT_LECTURE_MESSAGE = `
    INSERT INTO lecture_messages(lecture_id, user_id, message)
    VALUES ($1, $2, $3)
    RETURNING *
`;

interface LectureMessagesDB {
  list: (id: string) => Promise<LectureMessage[]>;
  insert: (msg: NewDBLectureMessage, id: string) => Promise<IDParam>;
}

const lectureMessagesDB: LectureMessagesDB = {
  async list(id) {
    const { rows } = await db.query(LIST_LECTURE_MESSAGES, [id]);
    return snakeToCamel(rows) || [];
  },
  async insert(msg, userID): Promise<IDParam> {
    const { rows } = await db.query(INSERT_LECTURE_MESSAGE, [msg.lectureId, userID, msg.message]);
    return snakeToCamel(rows[0]);
  },
};

export default lectureMessagesDB;
