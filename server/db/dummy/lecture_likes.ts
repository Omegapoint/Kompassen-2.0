import lectures from './lectures';
import users from './users';
import { NewDBLectureLike } from '../../src/lib/types';

const lectureLikes: NewDBLectureLike[] = [
  {
    lectureId: lectures[0].id,
    userId: users[0].id,
  },
  {
    lectureId: lectures[0].id,
    userId: users[1].id,
  },
];

export default lectureLikes;
