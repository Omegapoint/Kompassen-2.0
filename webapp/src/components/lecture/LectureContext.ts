import { createContext } from 'react';
import { Lecture, LectureMessage, UpdatedLectureMessage } from '../../lib/Types';

interface LectureCtx {
  lecture: Lecture;
  chat: LectureMessage[];
  sendWSMessage: (message: string) => void;
  updateWSMessage: (message: UpdatedLectureMessage) => void;
  deleteWSMessage: (message: UpdatedLectureMessage) => void;
}

const LectureContext = createContext<LectureCtx>({} as LectureCtx);

export default LectureContext;
