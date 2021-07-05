import { ObjectId } from 'mongodb';
import { filterOutID } from '../lib/lib';
import { Event } from '../lib/types';
import { conn } from '../lib/database';

const collectionName = 'events';

async function listAll(): Promise<Event[]> {
  const db = await conn;
  const collection = db.collection(collectionName);
  const r = await collection.find();
  return r.toArray();
}

async function getById(id: string): Promise<Event> {
  const collection = conn.collection(collectionName);
  return collection.findOne({ _id: new ObjectId(id) });
}

async function insert(event: Event): Promise<Event[]> {
  const collection = conn.collection(collectionName);
  const r = await collection.insertOne(event);
  return r.ops;
}

async function update(event: Event): Promise<number> {
  const collection = conn.collection(collectionName);
  const r = await collection.updateOne(
    { _id: new ObjectId(event._id) },
    { $set: { ...filterOutID(event) } }
  );
  return r.upsertedCount;
}

async function deleteById(id: string): Promise<number> {
  const collection = conn.collection(collectionName);
  const r = await collection.deleteOne({ _id: new ObjectId(id) });
  return r.deletedCount || 0;
}

const events = {
  insert,
  update,
  deleteById,
  getById,
  listAll,
};

export default events;
