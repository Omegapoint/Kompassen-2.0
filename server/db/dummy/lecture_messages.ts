import { DBLectureMessage } from '../../src/lib/types';
import lectures from './lectures';
import users from './users';

const lectureMessages: DBLectureMessage[] = [
  {
    id: 'c73e17ad-a7af-45af-9c66-436a594c2490',
    lectureID: lectures[0].id,
    userID: users[0].id,
    message: 'Bra post, kul att se.',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '75ef2c0f-c216-47ae-b11e-2db02d08fb2a',
    lectureID: lectures[0].id,
    userID: users[1].id,
    message: 'Nja, jag gillar inte det här 😖',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export default lectureMessages;
