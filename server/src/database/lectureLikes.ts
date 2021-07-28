import db from '../lib/database';
import { IDParam, NewLectureLike } from '../lib/types';

const INSERT_LECTURE_LIKE = `
    INSERT INTO lecture_likes(lecture_id, user_id)
    VALUES ($1, $2)
    RETURNING id
`;

const DELETE_LECTURE_LIKE = `
    DELETE
    FROM lecture_likes
    WHERE lecture_id = $1
      AND user_id = $2
    RETURNING id
`;

interface LectureLikesDB {
  insert: (msg: NewLectureLike, id: string) => Promise<IDParam>;
  delete: (lectureID: string, id: string) => Promise<IDParam>;
}

const lectureLikesDB: LectureLikesDB = {
  async insert(msg, userID): Promise<IDParam> {
    const { rows } = await db.query(INSERT_LECTURE_LIKE, [msg.lectureId, userID]);

    return rows[0];
  },
  async delete(lectureID, userID): Promise<IDParam> {
    const { rows } = await db.query(DELETE_LECTURE_LIKE, [lectureID, userID]);
    return rows[0];
  },
};

export default lectureLikesDB;
