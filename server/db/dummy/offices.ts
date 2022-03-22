import { Office } from '../../src/lib/types';
import users from './users';

const date = new Date();

const offices: Office[] = [
  {
    id: 'e165ee29-6477-4380-8457-001845390966',
    name: 'Stockholm',
    createdAt: date,
    createdBy: users[0].id,
    updatedAt: date,
    updatedBy: users[0].id,
  },
  {
    id: '3b8d5c34-78a6-458e-b249-6349f2db2cac',
    name: 'Umeå',
    createdAt: date,
    createdBy: users[0].id,
    updatedAt: date,
    updatedBy: users[0].id,
  },
  {
    id: 'dff5e789-b4e0-43c2-95c2-ac6c87242f34',
    name: 'Göteborg',
    createdAt: date,
    createdBy: users[0].id,
    updatedAt: date,
    updatedBy: users[0].id,
  },
];

export default offices;
