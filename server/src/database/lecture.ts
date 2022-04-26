import { logger } from '../config/config';
import db from '../lib/database';
import { snakeToCamel } from '../lib/lib';
import {
  CategoryStats,
  DLecture,
  IDParam,
  Lecture,
  TagStats,
  UpdatedDBLecture,
  UpdatedLectureIdea,
} from '../lib/types';

export const SELECT_LECTURES = `
    SELECT l.id,
           l.lecturer,
           l.lecturer_id,
           l.description,
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
           l.video_link,
           l.key_takeaway,
           l.approved,
           l.draft,
           (SELECT array_agg(lecture_likes.user_id) as likes FROM lecture_likes WHERE lecture_id = l.id),
           l.category_id,
           l.internal_presentation,
           l.target_audience,
           l.format_id,
           l.lecture_status_id,
           (SELECT jsonb_object_agg('status_id', status_id) from lecture_status where id = l.lecture_status_id) AS status,
           (SELECT json_agg(json_build_object('user_id', user_id, 'first_time_presenting', first_time_presenting)) from lecture_lecturers where lecture_id = l.id) AS lecturers
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

const INSERT_LECTURE = `
    INSERT INTO lectures(lecturer, lecturer_id, description, remote, event_id, duration, title,
                         category_id, max_participants, requirements, preparations, tags, message, idea, approved,
                         draft, video_link, key_takeaway, internal_presentation, target_audience, format_id, lecture_status_id, created_by, updated_by)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24)
    RETURNING id
`;

const UPDATE_LECTURE = `
    UPDATE lectures
    SET lecturer         = $1,
        lecturer_id      = $2,
        description      = $3,
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
        video_link       = $15,
        key_takeaway     = $16,
        updated_by       = $17,
        internal_presentation = $18,
        target_audience  = $19,
        format_id        = $20,
        lecture_status_id = $21
    WHERE id = $22
    RETURNING id
`;

const UPDATE_LECTURE_IDEA = `
    UPDATE lectures
    SET title       = $1,
        description = $2,
        tags        = $3
    WHERE id = $4
    RETURNING id
`;

const UPDATE_LECTURE_STATUS = `
    UPDATE lectures
    SET lecture_status_id = $1
    WHERE id = $2
    RETURNING id
`;

const UPDATE_LECTURE_VIDEO_LINK = `
    UPDATE lectures
    SET video_link = $1
    WHERE id = $2
    RETURNING id
`;

const APPROVE_LECTURE = `
    UPDATE lectures
    SET approved = $1
    WHERE id = $2
    RETURNING id
`;

const DELETE_LECTURE = `
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
  update: (lecture: UpdatedDBLecture, id: string) => Promise<IDParam>;
  updateIdea: (lecture: UpdatedLectureIdea) => Promise<IDParam>;
  approve: (approved: boolean, id: string) => Promise<IDParam>;
  setStatus: (lectureStatusID: string, lectureId: string) => Promise<IDParam>;
  setVideoLink: (videoLink: string, lectureId: string) => Promise<IDParam>;
  delete: (id: string) => Promise<IDParam>;
}

const lecturesDB: LecturesDB = {
  async list(idea, userID) {
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
    const { rows } = await db.query(INSERT_LECTURE, [
      lecture.lecturer,
      userID,
      lecture.description,
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
      lecture.approved,
      lecture.draft,
      lecture.videoLink,
      lecture.keyTakeaway,
      lecture.internalPresentation,
      lecture.targetAudience,
      lecture.formatID,
      lecture.lectureStatusID,
      userID,
      userID,
    ]);
    return rows[0];
  },

  async update(lecture, userID): Promise<IDParam> {
    const { rows } = await db.query(UPDATE_LECTURE, [
      lecture.lecturer,
      lecture.lecturerID,
      lecture.description,
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
      lecture.videoLink,
      lecture.keyTakeaway,
      userID,
      lecture.internalPresentation,
      lecture.targetAudience,
      lecture.formatID,
      lecture.lectureStatusID,
      lecture.id,
    ]);
    return rows[0];
  },

  async updateIdea(lecture): Promise<IDParam> {
    const { rows } = await db.query(UPDATE_LECTURE_IDEA, [
      lecture.title,
      lecture.description,
      lecture.tags,
      lecture.id,
    ]);
    return rows[0];
  },

  async setStatus(lectureStatusID, lectureId): Promise<IDParam> {
    const { rows } = await db.query(UPDATE_LECTURE_STATUS, [lectureStatusID, lectureId]);
    return rows[0];
  },

  async setVideoLink(videoLink, lectureId): Promise<IDParam> {
    const { rows } = await db.query(UPDATE_LECTURE_VIDEO_LINK, [videoLink, lectureId]);
    return rows[0];
  },

  async approve(approved, id): Promise<IDParam> {
    const { rows } = await db.query(APPROVE_LECTURE, [approved, id]);
    return rows[0];
  },

  async delete(id): Promise<IDParam> {
    const { rows } = await db.query(DELETE_LECTURE, [id]);
    return rows[0];
  },
};

export default lecturesDB;
