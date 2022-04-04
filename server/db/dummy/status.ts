import { Status } from '../../src/lib/types';
import users from './users';

const date = new Date();

const statuses: Status[] = [
  {
    id: 'ea399f36-1c38-4fd7-b838-c89fb663f818',
    name: 'Unhandled',
    createdAt: date,
    createdBy: users[0].id,
    updatedAt: date,
    updatedBy: users[0].id,
  },
  {
    id: 'd55d094a-f582-467d-bc83-9da6f891343b',
    name: 'Denied',
    createdAt: date,
    createdBy: users[0].id,
    updatedAt: date,
    updatedBy: users[0].id,
  },
  {
    id: '3e0be5ad-1768-48a3-b2b9-b6b10a079be1',
    name: 'Accepted',
    createdAt: date,
    createdBy: users[0].id,
    updatedAt: date,
    updatedBy: users[0].id,
  },
  {
    id: 'a249f431-5e4a-4a9a-a97c-a846f4ff61d2',
    name: 'Feedback',
    createdAt: date,
    createdBy: users[0].id,
    updatedAt: date,
    updatedBy: users[0].id,
  },
];

export default statuses;
