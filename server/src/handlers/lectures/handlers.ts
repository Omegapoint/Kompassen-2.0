import { httpError } from '../../lib/lib';
import { Request, Response } from 'express';
import { IDParam, Lecture, NewLecture, NewLectureIdea, UpdatedLecture } from '../../lib/types';
import lecturesDB from '../../database/lecture';
import {
  onCreatedLectureIdea,
  onDeleteLectureIdea,
  onUpdatedLectureIdea,
} from '../../ws/lectureIdeas';
import usersDB from '../../database/users';

interface Handlers {
  create: (req: Request<null, null, NewLecture>, res: Response) => Promise<void>;
  createIdea: (req: Request<null, null, NewLectureIdea>, res: Response) => Promise<void>;
  update: (req: Request<null, null, UpdatedLecture>, res: Response) => Promise<void>;
  getByID: (req: Request<IDParam, null, null>, res: Response) => Promise<void>;
  list: (req: Request<null, null, null>, res: Response) => Promise<void>;
  listTags: (req: Request<null, null, null>, res: Response) => Promise<void>;
  listCategories: (req: Request<IDParam, null, null>, res: Response) => Promise<void>;
  delete: (req: Request<IDParam, null, null>, res: Response) => Promise<void>;
}

const lectures: Handlers = {
  async create({ body }, res) {
    const { userId } = res.locals;
    const item = await lecturesDB.insert({ ...body, idea: false }, userId);
    res.send(item);
  },
  async createIdea({ body }, res) {
    const { userId } = res.locals;
    const item = await lecturesDB.insert(
      {
        ...body,
        idea: true,
        location: null,
        eventID: null,
        preparations: null,
        maxParticipants: null,
        requirements: null,
        duration: null,
        category: null,
        message: null,
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
  async getByID({ params }, res) {
    const item = await lecturesDB.getByID(params.id);
    if (!item) {
      httpError(res, 404, 'Location not found');
      return;
    }
    res.send(item);
  },
  async list(req, res) {
    const items = await lecturesDB.list();
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
