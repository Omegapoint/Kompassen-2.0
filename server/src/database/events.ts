import { logger } from '../config/config';
import db from '../lib/database';
import { snakeToCamel } from '../lib/lib';
import { Event, IDParam, NewEvent, UpdatedEvent } from '../lib/types';

const BASE_SELECT_EVENTS = `
    SELECT l.id,
           l.start_at,
           l.end_at,
           l.created_at,
           l.updated_at,
           u1.name as created_by,
           u2.name as updated_by
    FROM events l
             LEFT JOIN users u1 on l.created_by = u1.id
             LEFT JOIN users u2 on l.updated_by = u2.id
`;

const SELECT_EVENTS = `
    SELECT l.id,
           l.start_at,
           l.end_at,
           l.created_at,
           l.updated_at,
           u1.name as created_by,
           u2.name as updated_by
    FROM events l
             LEFT JOIN users u1 on l.created_by = u1.id
             LEFT JOIN users u2 on l.updated_by = u2.id
    WHERE l.end_at > now()
`;

const SELECT_EVENT_BY_ID = `
    ${BASE_SELECT_EVENTS}
    WHERE l.id = $1
`;

const INSERT_EVENT = `
    INSERT INTO events(start_at, end_at, created_by, updated_by)
    VALUES ($1, $2, $3, $3)
    RETURNING id
`;

const UPDATE_EVENT = `
    UPDATE events
    SET start_at   = $1,
        end_at     = $2,
        updated_by = $4
    WHERE id = $5
    RETURNING id
`;

const DELETE_EVENT = `
    DELETE
    FROM events
    WHERE id = $1
    RETURNING id
`;

interface EventsDB {
  list: (onlyNew: boolean) => Promise<Event[]>;
  getByID: (id: string) => Promise<Event | null>;
  insert: (event: NewEvent, id: string) => Promise<IDParam>;
  update: (event: UpdatedEvent, id: string) => Promise<IDParam>;
  delete: (id: string) => Promise<IDParam>;
}

const eventsDB: EventsDB = {
  async list(onlyNew: boolean) {
    const filter = onlyNew ? ' ORDER BY start_at' : '';
    const { rows } = await db.query(SELECT_EVENTS + filter);
    return snakeToCamel(rows) || [];
  },

  async getByID(id) {
    const { rows } = await db.query(SELECT_EVENT_BY_ID, [id]);
    if (!rows[0]) {
      logger.error(`could not find event with id = '${id}'`);
      return null;
    }
    return snakeToCamel(rows[0]);
  },

  async insert(event, userID): Promise<IDParam> {
    const { rows } = await db.query(INSERT_EVENT, [event.startAt, event.endAt, userID]);
    return rows[0];
  },

  async update(event, userID): Promise<IDParam> {
    const { rows } = await db.query(UPDATE_EVENT, [event.startAt, event.endAt, userID, event.id]);
    return rows[0];
  },

  async delete(id): Promise<IDParam> {
    const { rows } = await db.query(DELETE_EVENT, [id]);
    return rows[0];
  },
};

export default eventsDB;
