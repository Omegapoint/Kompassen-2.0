import setupExpress from './handlers/routes';
import config, { logger } from './config/config';
import { Server } from 'socket.io';
import * as http from 'http';
import { setupWebSocket } from './ws/socket';

(async (): Promise<void> => {
  const app = setupExpress();

  const server = http.createServer(app);
  const io = new Server(server, {
    cors: {
      origin: '*', // TODO: ONLY IN DEVELOPMENT
      methods: ['GET', 'POST'],
    },
  });

  setupWebSocket(io);

  server.listen({ port: config.port }, () =>
    logger.info(`Running at http://localhost:${config.port}`)
  );
})();
