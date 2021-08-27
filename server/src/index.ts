import * as http from 'http';
import { Server } from 'socket.io';
import config, { logger } from './config/config';
import setupExpress from './handlers/routes';
import { setupWebSocket } from './ws/socket';

// Setup express server
const app = setupExpress();
const server = http.createServer(app);

// Setup Socket IO
const opts =
  process.env.NODE_ENV === 'production' ? {} : { cors: { origin: '*', methods: ['GET', 'POST'] } };
const io = new Server(server, opts);
setupWebSocket(io);

server.listen({ port: config.port }, () =>
  logger.info(`Running at http://localhost:${config.port}`)
);
