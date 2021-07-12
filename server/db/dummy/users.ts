import { User } from '../../src/lib/types';

const date = new Date();

const users: User[] = [
  {
    id: '75442486-0878-440c-9db1-a7006c25a39f',
    name: 'Jan Bananberg',
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
    id: '11bf5b37-e0b8-42e0-8dcf-dc8c4aefc000',
    name: 'Katarina Apelsinskog',
    notifications: {
      newLecture: false,
      newComment: true,
      adminRead: false,
      lectureTaken: true,
    },
    createdAt: date,
    updatedAt: date,
  },
  {
    id: '4a612d67-31e3-4ad3-b503-93543ec54c27',
    name: 'Jonas Sjödin',
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
