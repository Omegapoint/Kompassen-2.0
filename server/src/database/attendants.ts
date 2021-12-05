import db from '../lib/database';
import { snakeToCamel } from '../lib/lib';
import { Attendant, BaseAttendant, IDParam, NewAttendant } from '../lib/types';

const SELECT_ATTENDANTS = `
    SELECT id,
           user_id,
           event_id,
           message,
           remote,
           created_at,
           created_by,
           updated_at,
           updated_by,
           (SELECT array_agg(lecture_attendants.lecture_id) as lectures
            FROM lecture_attendants
            WHERE attendant_id = a.id)
    FROM attendants a
    WHERE event_id = $1
`;

const CHECK_IF_ATTENDANT_EXISTS = `
    SELECT 1 as exists
    FROM attendants
    WHERE event_id = $1
      AND user_id = $2
`;

const INSERT_LECTURE_ATTENDANT = `
    INSERT INTO lecture_attendants(attendant_id, lecture_id)
    VALUES ($1, $2)
`;

const INSERT_ATTENDANT = `
    INSERT INTO attendants(user_id, event_id, message, remote, created_by, updated_by)
    VALUES ($1, $2, $3, $4, $5, $5)
    RETURNING id
`;

const CHECK_IF_ALREADY_ATTENDED = `
    SELECT 1 as exists
    FROM attendants
    WHERE event_id = $1
      AND user_id = $2
`;

const CHECK_IF_ALL_LECTURES_EXISTS = `
    SELECT 1 as exists
    FROM lectures
    WHERE id = $1
      AND event_id = $2
      AND approved = TRUE
        FOR UPDATE
`;

const DELETE_ATTENDANT = `
    DELETE
    FROM attendants
    WHERE event_id = $1
      AND user_id = $2
    RETURNING id
`;

const CHECK_IF_OPEN_FOR_REGISTRATION = `
    SELECT 1 as exists
    FROM events
    WHERE id = $1
      AND registration_start < now()
      AND registration_end > now()
        FOR UPDATE
`;

interface AttendantsDB {
  getAttendanceByEventID: (eventID: string) => Promise<Attendant | null>;
  isAttending: (eventId: string, userId: string) => Promise<boolean>;
  insert: (attendant: NewAttendant, id: string) => Promise<IDParam>;
  delete: (eventID: string, userID: string) => Promise<IDParam>;
}

const checkIfAlreadyAttended = async (eventID: string, userID: string) =>
  (await db.query(CHECK_IF_ALREADY_ATTENDED, [eventID, userID])).rows.length !== 0;

const checkIfAllLecturesExists = async (attendant: BaseAttendant) =>
  (
    await Promise.all(
      attendant.lectures.map(
        async (e) =>
          (
            await db.query(CHECK_IF_ALL_LECTURES_EXISTS, [e, attendant.eventID])
          ).rows[0].exists
      )
    )
  ).filter((e) => e).length === attendant.lectures.length;

const checkIfOpenForRegistration = async (attendant: BaseAttendant) =>
  (await db.query(CHECK_IF_OPEN_FOR_REGISTRATION, [attendant.eventID])).rows.length === 1;

const attendantsDB: AttendantsDB = {
  async getAttendanceByEventID(eventID) {
    const { rows } = await db.query(SELECT_ATTENDANTS, [eventID]);
    return snakeToCamel(rows);
  },

  async isAttending(eventId, userId) {
    const { rows } = await db.query(CHECK_IF_ATTENDANT_EXISTS, [eventId, userId]);
    return !!rows.length;
  },

  async insert(attendant, userID): Promise<IDParam> {
    const alreadyAttended = await checkIfAlreadyAttended(attendant.eventID, userID);
    if (alreadyAttended) {
      throw Error('User is already registered to the event.');
    }

    const allLecturesExists = checkIfAllLecturesExists(attendant);
    if (!allLecturesExists) {
      throw Error('all lectures are not connected to the specified event.');
    }
    const openForRegistration = checkIfOpenForRegistration(attendant);
    if (!openForRegistration) {
      throw Error('the event is not open for registration.');
    }

    const { rows } = await db.query(INSERT_ATTENDANT, [
      userID,
      attendant.eventID,
      attendant.message,
      attendant.remote,
      userID,
    ]);

    const attendantId = rows[0].id;
    await Promise.all(
      attendant.lectures.map(async (e) => db.query(INSERT_LECTURE_ATTENDANT, [attendantId, e]))
    );

    return rows[0];
  },

  async delete(eventID: string, userID: string) {
    const { rows } = await db.query(DELETE_ATTENDANT, [eventID, userID]);
    return rows[0];
  },
};

export default attendantsDB;
