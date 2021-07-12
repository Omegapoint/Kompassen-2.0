import { Location } from '../../src/lib/types';
import users from './users';
import { sub } from 'date-fns';

const date = new Date();

const locations: Location[] = [
  {
    id: 'd89461fa-f01d-4cb8-af74-caad923bd205',
    name: 'Stockholm',
    createdAt: date,
    createdBy: users[0].id,
    updatedAt: date,
    updatedBy: users[0].id,
  },
  {
    id: '0e422855-8576-4ac9-ad11-c9c0a74b81c1',
    name: 'Umeå',
    createdAt: sub(date, { months: 1 }),
    createdBy: users[1].id,
    updatedAt: sub(date, { months: 1 }),
    updatedBy: users[1].id,
  },
];

export default locations;
