import setupExpress from './handlers/handlers';

const { PORT = '8080' } = process.env;

(async (): Promise<void> => {
  const app = setupExpress();
  app.listen({ port: PORT }, () =>
    // eslint-disable-next-line no-console
    console.log(`Running at http://localhost:${PORT}`)
  );
})();
