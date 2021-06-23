import { MongoClient, MongoError } from 'mongodb';
import setupExpress from './handlers/handlers';
import config from './config/config';

(async (): Promise<void> => {
  const app = setupExpress();

  MongoClient.connect(config.mongo_url, {}, (err: MongoError, client: MongoClient) => {
    if (err) throw Error(`Failed to connect to the database. ${err.stack}`);
    app.locals.db = client.db();
    app.listen({ port: config.port }, () =>
      // eslint-disable-next-line no-console
      console.log(`Running at http://localhost:${config.port}`)
    );
  });
})();
