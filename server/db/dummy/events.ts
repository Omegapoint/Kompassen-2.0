import { Event } from '../../src/lib/types';
import { set, sub, add } from 'date-fns';
import users from './users';

const date = new Date();

const startTime = { hours: 13, minutes: 0, seconds: 0, milliseconds: 0 };
const endTime = { ...startTime, hours: 17 };
const startDate = set(date, startTime);
const endDate = set(date, endTime);

const events: Event[] = [
  {
    id: '30e4d13a-7767-4b43-a966-f50aaaa17d9f',
    startAt: sub(startDate, { months: 1 }),
    endAt: sub(endDate, { months: 1 }),
    createdAt: date,
    createdBy: users[0].id,
    updatedAt: date,
    updatedBy: users[0].id,
  },
  {
    id: '51914a7a-522c-422b-a3c0-0b65594d70af',
    startAt: startDate,
    endAt: endDate,
    createdAt: date,
    createdBy: users[1].id,
    updatedAt: date,
    updatedBy: users[1].id,
  },
  {
    id: 'faf29b61-6272-46c2-afa6-1f110b91b40f',
    startAt: add(startDate, { months: 1 }),
    endAt: add(endDate, { months: 1 }),
    createdAt: date,
    createdBy: users[0].id,
    updatedAt: date,
    updatedBy: users[0].id,
  },
];

export default events;
