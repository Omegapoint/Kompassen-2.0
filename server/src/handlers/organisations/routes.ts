import { Express } from 'express';
import { admin, locked } from '../auth';
import schema, { validate } from '../validationSchemas';
import organisations from './handlers';

const organisationRoutes = (app: Express): void => {
  app.post(
    '/organisation',
    admin,
    validate(schema.organisations.newOrganisation),
    organisations.create
  );
  app.put(
    '/organisation',
    admin,
    validate(schema.organisations.updateOrganisation),
    organisations.update
  );
  app.delete(
    '/organisation/:id',
    admin,
    validate(schema.uuidParam, 'params'),
    organisations.delete
  );
  app.get('/organisation', locked, organisations.list);
  app.get('/organisation/:id', locked, validate(schema.uuidParam, 'params'), organisations.getByID);
};

export default organisationRoutes;
