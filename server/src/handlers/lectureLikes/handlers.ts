import { httpError } from '../../lib/lib';
import { Request, Response } from 'express';
import { IDParam, Lecture } from '../../lib/types';
import lectureLikesDB from '../../database/lectureLikes';
import lecturesDB from '../../database/lecture';
import { onUpdatedLectureIdea } from '../../ws/lectureIdeas';

interface Handlers {
  create: (req: Request<IDParam, null, null>, res: Response) => Promise<void>;
  delete: (req: Request<IDParam, null, null>, res: Response) => Promise<void>;
}

const lectureLikes: Handlers = {
  async create({ params }, res) {
    const { userId } = res.locals;
    const item = await lectureLikesDB.insert({ lectureId: params.id }, userId);
    const lecture = await lecturesDB.getByID(params.id);
    if (lecture?.idea) onUpdatedLectureIdea(lecture as Lecture);
    res.send(item);
  },
  async delete({ params }, res) {
    const { userId } = res.locals;
    const item = await lectureLikesDB.delete(params.id, userId);
    if (!item) {
      httpError(res, 404, 'Lecture not found');
      return;
    }
    const lecture = await lecturesDB.getByID(params.id);
    if (lecture?.idea) onUpdatedLectureIdea(lecture as Lecture);
    res.send(item);
  },
};

export default lectureLikes;
