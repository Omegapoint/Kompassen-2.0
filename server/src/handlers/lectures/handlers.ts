import { Request, Response } from 'express';
import lecturesDB from '../../database/lecture';
import { httpError } from '../../lib/lib';
import {
  Approved,
  IDParam,
  Lecture,
  ListLecturesParams,
  NewLecture,
  NewLectureIdea,
  UpdatedLecture,
  UpdatedLectureIdea,
} from '../../lib/types';
import { lectureIdeasWS } from '../../ws/defaultWS';
import {
  onEventLectureCreate,
  onEventLectureDelete,
  onEventLectureUpdate,
} from '../../ws/eventLectures';

interface Handlers {
  create: (req: Request<null, null, NewLecture>, res: Response) => Promise<void>;
  createIdea: (req: Request<null, null, NewLectureIdea>, res: Response) => Promise<void>;
  updateIdea: (req: Request<null, null, UpdatedLectureIdea>, res: Response) => Promise<void>;
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
    const { userID } = res.locals;
    const item = await lecturesDB.insert(
      { ...body, lecturerID: userID, approved: false, idea: false },
      userID
    );
    res.send(item);
  },
  async createIdea({ body }, res) {
    const { userID } = res.locals;
    const lecturerID = body.lecturer ? userID : null;
    const item = await lecturesDB.insert(
      {
        ...body,
        lecturerID,
        idea: true,
        remote: null,
        eventID: null,
        preparations: null,
        maxParticipants: null,
        requirements: null,
        duration: null,
        categoryID: null,
        message: null,
        approved: false,
        draft: true,
      },
      userID
    );

    const lecture = await lecturesDB.getByID(item.id);
    lectureIdeasWS.onCreated(lecture as Lecture);
    onEventLectureCreate(lecture as Lecture);

    res.send(item);
  },
  async updateIdea({ body }, res) {
    const item = await lecturesDB.updateIdea(body);

    const lecture = await lecturesDB.getByID(item.id);
    lectureIdeasWS.onCreated(lecture as Lecture);
    onEventLectureCreate(lecture as Lecture);

    res.send(item);
  },
  async update({ body }, res) {
    const { userID } = res.locals;

    const currentLecture = await lecturesDB.getByID(body.id);

    if (!currentLecture) {
      httpError(res, 404, 'No lecture with that ID exists');
      return;
    }

    if (currentLecture?.lecturerID && userID !== currentLecture?.lecturerID) {
      httpError(res, 403, 'You cannot edit another lecturers lecture');
      return;
    }

    const lecturerID = currentLecture?.lecturerID || userID;

    const item = await lecturesDB.update({ ...body, lecturerID }, userID);

    const lecture = await lecturesDB.getByID(item.id);

    if (lecture?.idea) lectureIdeasWS.onUpdated(lecture as Lecture);
    onEventLectureUpdate(lecture as Lecture);
    res.send(item);
  },
  async approve({ body }, res) {
    const item = await lecturesDB.approve(body.approved, body.id);

    const lecture = await lecturesDB.getByID(item.id);
    if (lecture?.idea) lectureIdeasWS.onUpdated(lecture as Lecture);
    onEventLectureUpdate(lecture as Lecture);

    res.send(item);
  },
  async getByID({ params }, res) {
    const item = await lecturesDB.getByID(params.id);
    if (!item) {
      httpError(res, 404, 'Lecture not found');
      return;
    }
    res.send(item);
  },
  async list(req, res) {
    const { userID } = res.locals;
    const mine = req.query.mine === 'true';
    const items = await lecturesDB.list(false, mine ? userID : null);
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
    const { userID } = res.locals;

    const lecture = await lecturesDB.getByID(params.id);

    if (lecture?.lecturerID && userID !== lecture?.lecturerID) {
      httpError(res, 403, 'You cannot delete another lecturers lecture');
      return;
    }

    const item = await lecturesDB.delete(params.id);
    if (!item) {
      httpError(res, 404, 'Lecture not found');
      return;
    }
    if (lecture?.idea) lectureIdeasWS.onDelete({ id: params.id });
    onEventLectureDelete(lecture as Lecture);

    res.send(item);
  },
};

export default lectures;
