import { createContext } from 'react';
import { Lecture, LectureMessage } from '../../lib/Types';

interface LectureCtx {
  lecture: Lecture;
  chat: LectureMessage[];
  sendWSMessage: (message: string) => void;
}

const LectureContext = createContext<LectureCtx>({} as LectureCtx);

export default LectureContext;
