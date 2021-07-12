import { Knex } from 'knex';
import users from '../dummy/users';

const table = 'users';

export const seed = async (knex: Knex): Promise<void> =>
  knex(table)
    .del()
    .then(() => knex(table).insert(users));
