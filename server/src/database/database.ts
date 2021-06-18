import { MongoClient } from 'mongodb';

const url = 'mongodb://localhost:27017';

const setupDB = async (): Promise<MongoClient> => {
  const client = await MongoClient.connect(url, { useNewUrlParser: true }).catch((err) => {
    throw new Error(err);
  });
  if (!client) {
    throw new Error('Could not connect to database');
  }
  return client;
};

const mongoClient = setupDB();

export default mongoClient;
