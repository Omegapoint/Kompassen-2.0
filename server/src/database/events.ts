import { logger } from '../config/config';
import db from '../lib/database';
import { snakeToCamel } from '../lib/lib';
import { Event, IDParam, NewEvent, Room, UpdatedEvent } from '../lib/types';
import { onEventRoomDelete } from '../ws/lectureRooms';

const BASE_SELECT_EVENTS = `
    SELECT id,
           organisation_id,
           start_at,
           end_at,
           comment,
           registration_start,
           registration_end,
           created_at,
           created_by,
           updated_at,
           updated_by,
           published,
           (SELECT json_agg(t)
            FROM (
                     SELECT id,
                            name,
                            event_id
                     FROM rooms
                     WHERE event_id = e.id
                 ) t) as rooms
    FROM events e
`;

const SELECT_EVENT_BY_ID = `
    ${BASE_SELECT_EVENTS}
    WHERE id = $1
`;

const INSERT_EVENT = `
    INSERT INTO events(organisation_id, start_at, end_at, comment, registration_start, registration_end, created_by,
                       updated_by)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $7)
    RETURNING id
`;

const INSERT_ROOM = `
    INSERT INTO rooms(name, event_id)
    VALUES ($1, $2)
    RETURNING id
`;

const SELECT_ROOM = `
    SELECT id,
           name,
           event_id
    FROM rooms
    WHERE event_id = $1
`;

const DELETE_ROOM = `
    DELETE
    FROM rooms
    WHERE id = $1
`;

const UPDATE_EVENT = `
    UPDATE events
    SET organisation_id    = $1,
        start_at           = $2,
        end_at             = $3,
        comment            = $4,
        registration_start = $5,
        registration_end   = $6,
        updated_by         = $7,
        published          = $8
    WHERE id = $9
    RETURNING id
`;

const DELETE_EVENT = `
    DELETE
    FROM events
    WHERE id = $1
    RETURNING id
`;

interface EventsDB {
  list: (onlyNew?: boolean) => Promise<Event[]>;
  getByID: (id: string) => Promise<Event | null>;
  insert: (event: NewEvent, id: string) => Promise<IDParam>;
  update: (event: UpdatedEvent, id: string) => Promise<IDParam>;
  delete: (id: string) => Promise<IDParam>;
}

const parseEvent = (e: Event) => ({ ...e, rooms: e.rooms || [] });

const eventsDB: EventsDB = {
  async list(onlyNew?: boolean) {
    const filter = onlyNew ? 'WHERE end_at > now()' : '';
    const { rows } = await db.query(`${BASE_SELECT_EVENTS} ${filter} ORDER BY start_at`);

    return snakeToCamel(rows.map(parseEvent)) || [];
  },

  async getByID(id) {
    const { rows } = await db.query(SELECT_EVENT_BY_ID, [id]);
    if (!rows[0]) {
      logger.error(`could not find event with id = '${id}'`);
      return null;
    }
    return snakeToCamel(parseEvent(rows[0]));
  },

  async insert(event, userID): Promise<IDParam> {
    const created = await db.query(INSERT_EVENT, [
      event.organisationID,
      event.startAt,
      event.endAt,
      event.comment,
      event.registrationStart,
      event.registrationEnd,
      userID,
    ]);
    await Promise.all(event.rooms.map((e) => db.query(INSERT_ROOM, [e, created.rows[0].id])));

    return created.rows[0];
  },

  async update(event, userID): Promise<IDParam> {
    const { rows } = await db.query(UPDATE_EVENT, [
      event.organisationID,
      event.startAt,
      event.endAt,
      event.comment,
      event.registrationStart,
      event.registrationEnd,
      userID,
      event.published,
      event.id,
    ]);
    const rooms = await db.query<Room>(SELECT_ROOM, [event.id]);

    const oldRooms = rooms.rows;
    const newRoomNames = event.rooms;

    const onlyInOldRooms = oldRooms.filter((x) => !newRoomNames.includes(x.name));
    const onlyInNewRooms = newRoomNames.filter((x) => !oldRooms.find((y) => y.name === x));

    await Promise.all(onlyInOldRooms.map((e) => db.query<Room>(DELETE_ROOM, [e.id])));
    await Promise.all(onlyInNewRooms.map((e) => db.query<Room>(INSERT_ROOM, [e, event.id])));
    onlyInOldRooms.forEach((e) => onEventRoomDelete({ id: e.id }, event.id));
    return rows[0];
  },

  async delete(id): Promise<IDParam> {
    const { rows } = await db.query(DELETE_EVENT, [id]);
    return rows[0];
  },
};

export default eventsDB;
