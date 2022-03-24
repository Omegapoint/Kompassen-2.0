import { User } from '../../src/lib/types';

const date = new Date();

const users: User[] = [
  {
    id: '4a612d67-31e3-4ad3-b503-93543ec54c27',
    speakerBio: null,
    officeId: null,
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
    speakerBio: null,
    officeId: null,
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
    id: 'f45202d2-5a25-4053-8754-20b1814d92c2',
    speakerBio: null,
    officeId: null,
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
