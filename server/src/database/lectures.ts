import { ObjectId } from 'mongodb';
import { filterOutID } from '../lib/lib';
import { Lecture } from '../lib/types';
import { conn } from '../lib/database';

const collectionName = 'lectures';

async function listAll(): Promise<Lecture[]> {
  const db = await conn;
  const collection = db.collection(collectionName);
  const r = await collection.find();
  return r.toArray();
}

async function getById(id: string): Promise<Lecture> {
  const collection = conn.collection(collectionName);
  return collection.findOne({ _id: new ObjectId(id) });
}

async function insert(lecture: Lecture): Promise<Lecture[]> {
  const collection = conn.collection(collectionName);
  const r = await collection.insertOne(lecture);
  return r.ops;
}

async function update(lecture: Lecture): Promise<number> {
  const collection = conn.collection(collectionName);
  const r = await collection.updateOne(
    { _id: new ObjectId(lecture._id) },
    { $set: { ...filterOutID(lecture) } }
  );
  return r.upsertedCount;
}

async function deleteById(id: string): Promise<number> {
  const collection = conn.collection(collectionName);
  const r = await collection.deleteOne({ _id: new ObjectId(id) });
  return r.deletedCount || 0;
}

const lectures = {
  insert,
  update,
  deleteById,
  getById,
  listAll,
};

export default lectures;
