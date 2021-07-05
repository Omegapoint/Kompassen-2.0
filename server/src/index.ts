import setupExpress from './handlers/handlers';
import config, { logger } from './config/config';
import { setupDb } from './lib/database';

(async (): Promise<void> => {
  const app = setupExpress();

  await setupDb();
  app.listen({ port: config.port }, () =>
    logger.info(`Running at http://localhost:${config.port}`)
  );
})();
