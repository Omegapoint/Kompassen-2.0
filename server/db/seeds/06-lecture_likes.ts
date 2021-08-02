import { Knex } from 'knex';
import lectureLikes from '../dummy/lecture_likes';

const table = 'lecture_likes';

export const seed = async (knex: Knex): Promise<void> =>
  knex(table)
    .del()
    .then(() => knex(table).insert(lectureLikes));
