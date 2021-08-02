import lectures from './lectures';
import users from './users';
import { NewDBLectureLike } from '../../src/lib/types';

const lectureLikes: NewDBLectureLike[] = [
  {
    lectureID: lectures[0].id,
    userID: users[0].id,
  },
  {
    lectureID: lectures[0].id,
    userID: users[1].id,
  },
];

export default lectureLikes;
