import { Db, ObjectId } from 'mongodb';
import { filterOutID, ID } from '../lib/lib';

export interface Post extends ID {
  quote: string;
  name: string;
  createdAt: string;
}

const documentName = 'posts';

async function insertPost(db: Db, quote: Post): Promise<Post[]> {
  const collection = db.collection(documentName);
  const r = await collection.insertOne(quote);
  return r.ops;
}

async function updatePost(db: Db, quote: Post): Promise<number> {
  const collection = db.collection(documentName);
  const r = await collection.updateOne(
    { _id: new ObjectId(quote._id) },
    { $set: { ...filterOutID(quote) } }
  );
  return r.upsertedCount;
}

async function deletePost(db: Db, id: string): Promise<number> {
  const collection = db.collection(documentName);
  const r = await collection.deleteOne({ _id: new ObjectId(id) });
  return r.deletedCount || 0;
}

async function getPost(db: Db, id: string): Promise<Post> {
  const collection = db.collection(documentName);
  return collection.findOne({ _id: new ObjectId(id) });
}

async function listPosts(db: Db): Promise<Post[]> {
  const collection = db.collection(documentName);
  const r = await collection.find();
  return r.toArray();
}

const db = {
  insertPost,
  updatePost,
  deletePost,
  getPost,
  listPosts,
};

export default db;
