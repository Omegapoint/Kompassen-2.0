import { User } from '../../src/lib/types';

const date = new Date();

const users: User[] = [
  {
    id: '4a612d67-31e3-4ad3-b503-93543ec54c27',
    notifications: {
      newLecture: true,
      newComment: true,
      adminRead: true,
      lectureTaken: true,
    },
    createdAt: date,
    updatedAt: date,
  },
  {
    id: '23a416c5-7dab-4c84-aff1-fd22ec61386d',
    notifications: {
      newLecture: true,
      newComment: true,
      adminRead: true,
      lectureTaken: true,
    },
    createdAt: date,
    updatedAt: date,
  },
];

export default users;
