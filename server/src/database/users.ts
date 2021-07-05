import { Event, User } from '../lib/types';
import { conn } from '../lib/database';

const collectionName = 'users';

async function insert(user: User): Promise<User[]> {
  const collection = conn.collection(collectionName);
  const r = await collection.insertOne(user);
  return r.ops;
}

async function getById(_id: string): Promise<Event> {
  const collection = conn.collection(collectionName);
  return collection.findOne({ _id });
}

const users = {
  insert,
  getById,
};

export default users;
