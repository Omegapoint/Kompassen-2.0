import { Request, Response } from 'express';
import lecturesDB from '../../database/lecture';
import usersDB from '../../database/users';
import { httpError } from '../../lib/lib';
import {
  Approved,
  IDParam,
  Lecture,
  ListLecturesParams,
  NewLecture,
  NewLectureIdea,
  UpdatedLecture,
} from '../../lib/types';
import {
  onCreatedLectureIdea,
  onDeleteLectureIdea,
  onUpdatedLectureIdea,
} from '../../ws/lectureIdeas';

interface Handlers {
  create: (req: Request<null, null, NewLecture>, res: Response) => Promise<void>;
  createIdea: (req: Request<null, null, NewLectureIdea>, res: Response) => Promise<void>;
  update: (req: Request<null, null, UpdatedLecture>, res: Response) => Promise<void>;
  approve: (req: Request<null, null, Approved>, res: Response) => Promise<void>;
  getByID: (req: Request<IDParam, null, null>, res: Response) => Promise<void>;
  list: (req: Request<null, ListLecturesParams, null>, res: Response) => Promise<void>;
  listTags: (req: Request<null, null, null>, res: Response) => Promise<void>;
  listCategories: (req: Request<IDParam, null, null>, res: Response) => Promise<void>;
  delete: (req: Request<IDParam, null, null>, res: Response) => Promise<void>;
}

const lectures: Handlers = {
  async create({ body }, res) {
    const { userId } = res.locals;
    const item = await lecturesDB.insert(
      { ...body, lecturerId: userId, approved: false, idea: false },
      userId
    );
    res.send(item);
  },
  async createIdea({ body }, res) {
    const { userId } = res.locals;
    const lecturerId = body.lecturer ? userId : null;
    const item = await lecturesDB.insert(
      {
        ...body,
        lecturerId,
        idea: true,
        location: null,
        eventID: null,
        preparations: null,
        maxParticipants: null,
        requirements: null,
        duration: null,
        categoryId: null,
        message: null,
        approved: false,
        published: false,
      },
      userId
    );

    const lecture = await lecturesDB.getByID(item.id);
    onCreatedLectureIdea(lecture as Lecture);

    res.send(item);
  },
  async update({ body }, res) {
    const { userId } = res.locals;

    const currentUser = await usersDB.getByID(userId);

    const currentLecture = await lecturesDB.getByID(body.id);

    if (currentLecture?.lecturer && currentUser?.name !== currentLecture?.lecturer) {
      httpError(res, 403, 'You cannot edit another lecturers lecture');
      return;
    }

    const item = await lecturesDB.update(body, userId);

    const lecture = await lecturesDB.getByID(item.id);
    if (lecture?.idea) onUpdatedLectureIdea(lecture as Lecture);

    res.send(item);
  },
  async approve({ body }, res) {
    const item = await lecturesDB.approve(body.approved, body.id);

    const lecture = await lecturesDB.getByID(item.id);
    if (lecture?.idea) onUpdatedLectureIdea(lecture as Lecture);

    res.send(item);
  },
  async getByID({ params }, res) {
    const item = await lecturesDB.getByID(params.id);
    if (!item) {
      httpError(res, 404, 'Location not found');
      return;
    }
    res.send(item);
  },
  async list(req, res) {
    const { userId } = res.locals;
    const mine = req.query.mine === 'true';
    const items = await lecturesDB.list(false, mine ? userId : null);
    res.send(items);
  },
  async listTags(req, res) {
    const items = await lecturesDB.listTags();
    res.send(items);
  },
  async listCategories({ params }, res) {
    const items = await lecturesDB.listCategories(params.id);
    res.send(items);
  },
  async delete({ params }, res) {
    const lecture = await lecturesDB.getByID(params.id);
    const item = await lecturesDB.delete(params.id);
    if (!item) {
      httpError(res, 404, 'Location not found');
      return;
    }
    if (lecture?.idea) onDeleteLectureIdea(params.id);

    res.send(item);
  },
};

export default lectures;
