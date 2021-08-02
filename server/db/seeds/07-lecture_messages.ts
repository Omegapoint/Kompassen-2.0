import { Knex } from 'knex';
import lectureMessages from '../dummy/lecture_messages';

const table = 'lectureMessages';

export const seed = async (knex: Knex): Promise<void> =>
  knex(table)
    .del()
    .then(() => knex(table).insert(lectureMessages));
