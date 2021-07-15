import db from '../lib/database';
import { logger } from '../config/config';
import { CategoryStats, DLecture, IDParam, Lecture, TagStats, UpdatedLecture } from '../lib/types';
import { snakeToCamel } from '../lib/lib';

const SELECT_EVENTS = `
    SELECT l.id,
           l.lecturer,
           l.description,
           l.location,
           l.event_id,
           l.duration,
           l.title,
           l.category,
           l.max_participants,
           l.requirements,
           l.preparations,
           l.tags,
           l.idea,
           l.created_at,
           l.updated_at,
           u1.name as created_by,
           u2.name as updated_by,
           (SELECT array_agg(lecture_likes.user_id) as likes FROM lecture_likes WHERE lecture_id = l.id)
    FROM lectures l
             LEFT JOIN users u1 on l.created_by = u1.id
             LEFT JOIN users u2 on l.updated_by = u2.id
`;

const SELECT_TAGS = `
    SELECT json_agg(t)
    FROM (
             SELECT unnest(tags) AS tag, count(*) as count
             FROM lectures
             GROUP BY tag
             ORDER BY count
         ) t
`;

const SELECT_CATEGORY = `
    SELECT json_agg(t)
    FROM (
             SELECT category, count(*) as count
             FROM lectures
             WHERE event_id = $1
             GROUP BY category
             ORDER BY count
         ) t
`;

const SELECT_EVENT_BY_ID = `
    ${SELECT_EVENTS}
    WHERE l.id = $1
`;

const INSERT_EVENT = `
    INSERT INTO lectures(lecturer, description, location, event_id, duration, title, category, max_participants,
                         requirements, preparations, tags, idea, created_by, updated_by)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $13)
    RETURNING id
`;

const UPDATE_EVENT = `
    UPDATE lectures
    SET lecturer         = $1,
        description      = $2,
        location         = $3,
        event_id         = $4,
        duration         = $5,
        title            = $6,
        category         = $7,
        max_participants = $8,
        requirements     = $9,
        preparations     = $10,
        tags             = $11,
        updated_by       = $12
    WHERE id = $13
    RETURNING id
`;

const DELETE_EVENT = `
    DELETE
    FROM lectures
    WHERE id = $1
    RETURNING id
`;

interface LecturesDB {
  list: (idea?: boolean) => Promise<Lecture[]>;
  listTags: () => Promise<TagStats[]>;
  listCategories: (id: string) => Promise<CategoryStats[]>;
  getByID: (id: string) => Promise<Lecture | null>;
  insert: (lecture: DLecture, id: string) => Promise<IDParam>;
  update: (lecture: UpdatedLecture, id: string) => Promise<IDParam>;
  delete: (id: string) => Promise<IDParam>;
}

const lecturesDB: LecturesDB = {
  async list(idea = false) {
    const whereClause = idea ? 'WHERE l.idea = TRUE' : '';
    const { rows } = await db.query(`${SELECT_EVENTS} ${whereClause} ORDER BY l.updated_at DESC`);
    return snakeToCamel(rows) || [];
  },

  async listTags() {
    const { rows } = await db.query(SELECT_TAGS);
    return snakeToCamel(rows[0].json_agg) || [];
  },

  async listCategories(id: string) {
    const { rows } = await db.query(SELECT_CATEGORY, [id]);
    return snakeToCamel(rows[0].json_agg) || [];
  },

  async getByID(id) {
    const { rows } = await db.query(SELECT_EVENT_BY_ID, [id]);
    if (!rows[0]) {
      logger.error(`could not find lecture with id = '${id}'`);
      return null;
    }
    return snakeToCamel(rows[0]);
  },

  async insert(lecture, userID): Promise<IDParam> {
    const { rows } = await db.query(INSERT_EVENT, [
      lecture.lecturer,
      lecture.description,
      lecture.location,
      lecture.eventID,
      lecture.duration,
      lecture.title,
      lecture.category,
      lecture.maxParticipants,
      lecture.requirements,
      lecture.preparations,
      lecture.tags,
      lecture.idea,
      userID,
    ]);
    return rows[0];
  },

  async update(lecture, userID): Promise<IDParam> {
    const { rows } = await db.query(UPDATE_EVENT, [
      lecture.lecturer,
      lecture.description,
      lecture.location,
      lecture.eventID,
      lecture.duration,
      lecture.title,
      lecture.category,
      lecture.maxParticipants,
      lecture.requirements,
      lecture.preparations,
      lecture.tags,
      userID,
    ]);
    return rows[0];
  },

  async delete(id): Promise<IDParam> {
    const { rows } = await db.query(DELETE_EVENT, [id]);
    return rows[0];
  },
};

export default lecturesDB;
