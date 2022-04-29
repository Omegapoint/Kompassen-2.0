import db from '../lib/database';
import { snakeToCamel } from '../lib/lib';
import {
  DBLectureMessage,
  IDParam,
  LectureMessage,
  NewDBLectureMessage,
  UpdatedLectureMessage,
} from '../lib/types';

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

const UPDATE_LECTURE_MESSAGE = `
    UPDATE lecture_messages
    SET message = $2
    WHERE id = $1
    RETURNING *
`;

const DELETE_LECTURE_MESSAGE = `
    DELETE
    FROM lecture_messages
    WHERE id = $1
    RETURNING id
`;

interface LectureMessagesDB {
  list: (id: string) => Promise<LectureMessage[]>;
  insert: (msg: NewDBLectureMessage, userID: string) => Promise<DBLectureMessage>;
  update: (msg: UpdatedLectureMessage) => Promise<DBLectureMessage>;
  delete: (id: string) => Promise<IDParam>;
}

const lectureMessagesDB: LectureMessagesDB = {
  async list(id: string) {
    const { rows } = await db.query(LIST_LECTURE_MESSAGES, [id]);
    return snakeToCamel(rows) || [];
  },
  async insert(msg: NewDBLectureMessage, userID: string): Promise<DBLectureMessage> {
    const { rows } = await db.query(INSERT_LECTURE_MESSAGE, [msg.lectureID, userID, msg.message]);
    return snakeToCamel(rows[0]);
  },
  async update(msg: UpdatedLectureMessage): Promise<DBLectureMessage> {
    const { rows } = await db.query(UPDATE_LECTURE_MESSAGE, [msg.id, msg.message]);
    return rows[0];
  },
  async delete(id: string): Promise<IDParam> {
    const { rows } = await db.query(DELETE_LECTURE_MESSAGE, [id]);
    return rows[0];
  },
};

export default lectureMessagesDB;
