import { add, set, sub } from 'date-fns';
import { DBEvent } from '../../src/lib/types';
import organisations from './organisations';
import users from './users';

const date = new Date();

const startTime = { hours: 13, minutes: 0, seconds: 0, milliseconds: 0 };
const endTime = { ...startTime, hours: 17 };
const startDate = set(date, startTime);
const endDate = set(date, endTime);

const events: DBEvent[] = [
  {
    id: '30e4d13a-7767-4b43-a966-f50aaaa17d9f',
    organisationID: organisations[0].id,
    startAt: sub(startDate, { months: 1 }),
    endAt: sub(endDate, { months: 1 }),
    comment: 'Gör något om ni vill',
    createdAt: date,
    createdBy: users[0].id,
    updatedAt: date,
    updatedBy: users[0].id,
  },
  {
    id: '51914a7a-522c-422b-a3c0-0b65594d70af',
    organisationID: organisations[1].id,
    startAt: startDate,
    endAt: endDate,
    comment: 'Gör något om ni vill, joo',
    createdAt: date,
    createdBy: users[1].id,
    updatedAt: date,
    updatedBy: users[1].id,
  },
  {
    id: 'faf29b61-6272-46c2-afa6-1f110b91b40f',
    organisationID: organisations[0].id,
    startAt: add(startDate, { months: 1 }),
    endAt: add(endDate, { months: 1 }),
    comment: 'Gör något om ni vill, kanske',
    createdAt: date,
    createdBy: users[0].id,
    updatedAt: date,
    updatedBy: users[0].id,
  },
];

export default events;
