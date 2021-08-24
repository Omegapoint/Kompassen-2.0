import { logger } from '../config/config';
import db from '../lib/database';
import { snakeToCamel } from '../lib/lib';
import { CategoryStats, DLecture, IDParam, Lecture, TagStats, UpdatedLecture } from '../lib/types';

export const SELECT_LECTURES = `
    SELECT l.id,
           l.lecturer,
           l.lecturer_id,
           l.description,
           l.location_id,
           l.remote,
           l.event_id,
           l.duration,
           l.title,
           l.max_participants,
           l.requirements,
           l.preparations,
           l.tags,
           l.message,
           l.idea,
           l.created_at,
           l.created_by,
           l.updated_at,
           l.updated_by,
           l.approved,
           l.draft,
           (SELECT array_agg(lecture_likes.user_id) as likes FROM lecture_likes WHERE lecture_id = l.id),
           l.category_id
    FROM lectures l
`;

const SELECT_EVENT_LECTURES = `
    ${SELECT_LECTURES}
    WHERE event_id = $1
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
             SELECT category_id, count(*) as count
             FROM lectures
             WHERE event_id = $1
             GROUP BY category_id
             ORDER BY count
         ) t
`;

const SELECT_LECTURE_BY_ID = `
    ${SELECT_LECTURES}
    WHERE l.id = $1
`;

const INSERT_EVENT = `
    INSERT INTO lectures(lecturer, lecturer_id, description, location_id, remote, event_id, duration, title,
                         category_id, max_participants, requirements, preparations, tags, message, idea, approved,
                         draft, created_by, updated_by)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $18)
    RETURNING id
`;

const UPDATE_EVENT = `
    UPDATE lectures
    SET lecturer         = $1,
        description      = $2,
        location_id      = $3,
        remote           = $4,
        event_id         = $5,
        duration         = $6,
        title            = $7,
        category_id      = $8,
        max_participants = $9,
        requirements     = $10,
        preparations     = $11,
        tags             = $12,
        message          = $13,
        draft            = $14,
        updated_by       = $15
    WHERE id = $16
    RETURNING id
`;

const APPROVE_EVENT = `
    UPDATE lectures
    SET approved = $1
    WHERE id = $2
    RETURNING id
`;

const DELETE_EVENT = `
    DELETE
    FROM lectures
    WHERE id = $1
    RETURNING id
`;

interface LecturesDB {
  list: (idea?: boolean, userID?: string) => Promise<Lecture[]>;
  listTags: () => Promise<TagStats[]>;
  listCategories: (id: string) => Promise<CategoryStats[]>;
  listEventLectures: (id: string) => Promise<Lecture[]>;
  getByID: (id: string) => Promise<Lecture | null>;
  insert: (lecture: DLecture, id: string) => Promise<IDParam>;
  update: (lecture: UpdatedLecture, id: string) => Promise<IDParam>;
  approve: (approved: boolean, id: string) => Promise<IDParam>;
  delete: (id: string) => Promise<IDParam>;
}

const lecturesDB: LecturesDB = {
  async list(idea = false, userID) {
    const whereClause = idea ? 'WHERE l.idea = TRUE' : '';
    const userClause = userID ? 'WHERE l.lecturer_id = $1' : '';
    const { rows } = await db.query(
      `${SELECT_LECTURES} ${whereClause} ${userClause} ORDER BY l.updated_at DESC`,
      [userID].filter((e) => e)
    );

    return snakeToCamel(rows) || [];
  },

  async listEventLectures(id) {
    const { rows } = await db.query(SELECT_EVENT_LECTURES, [id]);

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
    const { rows } = await db.query(SELECT_LECTURE_BY_ID, [id]);
    if (!rows[0]) {
      logger.error(`could not find lecture with id = '${id}'`);
      return null;
    }
    return snakeToCamel(rows[0]);
  },

  async insert(lecture, userID): Promise<IDParam> {
    const { rows } = await db.query(INSERT_EVENT, [
      lecture.lecturer,
      userID,
      lecture.description,
      lecture.locationID,
      lecture.remote,
      lecture.eventID,
      lecture.duration,
      lecture.title,
      lecture.categoryID,
      lecture.maxParticipants,
      lecture.requirements,
      lecture.preparations,
      lecture.tags,
      lecture.message,
      lecture.idea,
      false,
      lecture.draft,
      userID,
    ]);
    return rows[0];
  },

  async update(lecture, userID): Promise<IDParam> {
    const { rows } = await db.query(UPDATE_EVENT, [
      lecture.lecturer,
      lecture.description,
      lecture.locationID,
      lecture.remote,
      lecture.eventID,
      lecture.duration,
      lecture.title,
      lecture.categoryID,
      lecture.maxParticipants,
      lecture.requirements,
      lecture.preparations,
      lecture.tags,
      lecture.message,
      lecture.draft,
      userID,
      lecture.id,
    ]);
    return rows[0];
  },

  async approve(approved, id): Promise<IDParam> {
    const { rows } = await db.query(APPROVE_EVENT, [approved, id]);
    return rows[0];
  },

  async delete(id): Promise<IDParam> {
    const { rows } = await db.query(DELETE_EVENT, [id]);
    return rows[0];
  },
};

export default lecturesDB;
