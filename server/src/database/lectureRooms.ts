import { logger } from '../config/config';
import db from '../lib/database';
import { snakeToCamel } from '../lib/lib';
import { IDParam, LectureRoom, NewLectureRoom, UpdatedLectureRoom } from '../lib/types';

const SELECT_LECTURE_ROOMS = `
    SELECT id,
           room_id,
           lecture_id,
           start_at
    FROM lecture_rooms
    WHERE lecture_id IN (
        SELECT id
        FROM lectures
        WHERE approved = TRUE
          AND event_id = $1
    )
      AND room_id IN (
        SELECT id
        FROM rooms
        WHERE event_id = $1
    )
`;

const SELECT_LECTURE_ROOM_BY_ID = `
    SELECT id,
           room_id,
           lecture_id,
           start_at
    FROM lecture_rooms
    WHERE id = $1
`;

const INSERT_LECTURE_ROOM = `
    INSERT INTO lecture_rooms(room_id, lecture_id, start_at)
    SELECT $1,
           $2,
           $3 WHERE EXISTS(
                  SELECT 1 FROM events WHERE id = $4 ) RETURNING id
`;

const UPDATE_LECTURE_ROOM = `
    UPDATE lecture_rooms
    SET room_id    = $1,
        lecture_id = $2,
        start_at   = $3
    WHERE id = $4 RETURNING id
`;

const DELETE_LECTURE_ROOM = `
    DELETE
    FROM lecture_rooms
    WHERE id = $1 RETURNING id
`;

interface LectureRoomsDB {
  list: (eventID: string) => Promise<LectureRoom>;
  getByID: (id: string) => Promise<LectureRoom | null>;
  insert: (lectureRoom: NewLectureRoom) => Promise<IDParam>;
  update: (lectureRoom: UpdatedLectureRoom) => Promise<IDParam>;
  delete: (lectureID: string) => Promise<IDParam>;
}

const lectureRoomsDB: LectureRoomsDB = {
  async list(eventID) {
    const { rows } = await db.query(SELECT_LECTURE_ROOMS, [eventID]);
    return snakeToCamel(rows) || [];
  },
  async getByID(id) {
    const { rows } = await db.query(SELECT_LECTURE_ROOM_BY_ID, [id]);
    if (!rows[0]) {
      logger.error(`could not find lecture_room with id = '${id}'`);
      return null;
    }
    return snakeToCamel(rows[0]);
  },
  async insert(lectureRoom): Promise<IDParam> {
    const { rows } = await db.query(INSERT_LECTURE_ROOM, [
      lectureRoom.roomID,
      lectureRoom.lectureID,
      lectureRoom.startAt,
      lectureRoom.eventID,
    ]);

    return rows[0];
  },
  async update(lectureRoom): Promise<IDParam> {
    const { rows } = await db.query(UPDATE_LECTURE_ROOM, [
      lectureRoom.roomID,
      lectureRoom.lectureID,
      lectureRoom.startAt,
      lectureRoom.id,
    ]);

    return rows[0];
  },
  async delete(lectureID): Promise<IDParam> {
    const { rows } = await db.query(DELETE_LECTURE_ROOM, [lectureID]);
    return rows[0];
  },
};

export default lectureRoomsDB;
