import { Office } from '../../src/lib/types';
import users from './users';

const date = new Date();

const offices: Office[] = [
  {
    id: 'ea399f36-1c38-4fd7-b838-c89fb663f818',
    name: 'Stockholm OP',
    createdAt: date,
    createdBy: users[0].id,
    updatedAt: date,
    updatedBy: users[0].id,
  },
  {
    id: 'd55d094a-f582-467d-bc83-9da6f891343b',
    name: 'Uppsala OP',
    createdAt: date,
    createdBy: users[0].id,
    updatedAt: date,
    updatedBy: users[0].id,
  },
  {
    id: '3e0be5ad-1768-48a3-b2b9-b6b10a079be1',
    name: 'Malmö OP',
    createdAt: date,
    createdBy: users[0].id,
    updatedAt: date,
    updatedBy: users[0].id,
  },
  {
    id: 'a249f431-5e4a-4a9a-a97c-a846f4ff61d2',
    name: 'Umeå OP',
    createdAt: date,
    createdBy: users[0].id,
    updatedAt: date,
    updatedBy: users[0].id,
  },
  {
    id: '192cf114-0279-4eba-b969-b15e32d2475f',
    name: 'Göteborg OP',
    createdAt: date,
    createdBy: users[0].id,
    updatedAt: date,
    updatedBy: users[0].id,
  },
  {
    id: '06bc8d77-8e73-4803-9465-cfb461e6cf5c',
    name: 'Integrationsbolaget',
    createdAt: date,
    createdBy: users[0].id,
    updatedAt: date,
    updatedBy: users[0].id,
  },
  {
    id: '6a9812cb-57ec-4053-88d9-6e709a9460cf',
    name: 'Molnbolaget',
    createdAt: date,
    createdBy: users[0].id,
    updatedAt: date,
    updatedBy: users[0].id,
  },
];

export default offices;
