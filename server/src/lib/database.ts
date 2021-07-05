import { Db, MongoClient } from 'mongodb';
import config from '../config/config';

// eslint-disable-next-line import/no-mutable-exports
export let conn: Db;

export const setupDb = async (): Promise<void> => {
  try {
    const client = await MongoClient.connect(config.mongoURL, {});
    conn = client.db();
  } catch (err) {
    throw Error(`Failed to connect to the database. ${err.stack}`);
  }
};
