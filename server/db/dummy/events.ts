import { add, set, sub } from 'date-fns';
import { DBEvent } from '../../src/lib/types';
import organisations from './organisations';
import users from './users';

const date = add(new Date(), { days: 1 });

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
    registrationStart: sub(date, { months: 1, days: 10 }),
    registrationEnd: sub(date, { months: 1, days: 5 }),
    createdAt: date,
    createdBy: users[0].id,
    updatedAt: date,
    updatedBy: users[0].id,
    published: false,
  },
  {
    id: '51914a7a-522c-422b-a3c0-0b65594d70af',
    organisationID: organisations[1].id,
    startAt: startDate,
    endAt: endDate,
    comment: 'Gör något om ni vill, joo',
    registrationStart: sub(startDate, { days: 10 }),
    registrationEnd: add(startDate, { hours: 12 }),
    createdAt: date,
    createdBy: users[1].id,
    updatedAt: date,
    updatedBy: users[1].id,
    published: false,
  },
  {
    id: 'faf29b61-6272-46c2-afa6-1f110b91b40f',
    organisationID: organisations[0].id,
    startAt: add(startDate, { months: 1 }),
    endAt: add(endDate, { months: 1 }),
    comment: 'Gör något om ni vill, kanske',
    registrationStart: add(date, { days: 5 }),
    registrationEnd: add(date, { days: 10 }),
    createdAt: date,
    createdBy: users[0].id,
    updatedAt: date,
    updatedBy: users[0].id,
    published: false,
  },
  {
    id: '334de9fb-058d-4eaa-a698-ca58aa2d2ab0',
    organisationID: organisations[2].id,
    startAt: add(startDate, { months: 1 }),
    endAt: add(endDate, { months: 1 }),
    comment: 'OPKoKo 22:1',
    registrationStart: add(date, { days: 5 }),
    registrationEnd: add(date, { days: 10 }),
    createdAt: date,
    createdBy: users[0].id,
    updatedAt: date,
    updatedBy: users[0].id,
    published: false,
  },
];

export default events;
