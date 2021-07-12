import schema, { validate } from '../validationSchemas';
import { Express } from 'express';
import { admin, locked } from '../auth';
import lectures from './handlers';

const lecturesRoutes = (app: Express): void => {
  app.post('/lecture', admin, validate(schema.lectures.newLecture), lectures.create);
  app.post('/lecture/idea', admin, validate(schema.lectures.newIdea), lectures.createIdea);
  app.put('/lecture', admin, validate(schema.lectures.updateLecture), lectures.update);
  app.delete('/lecture/:id', admin, validate(schema.uuidParam, 'params'), lectures.delete);
  app.get('/lecture/tag', locked, lectures.listTags);
  app.get(
    '/lecture/:id/category',
    locked,
    validate(schema.uuidParam, 'params'),
    lectures.listCategories
  );
  app.get('/lecture', locked, lectures.list);
  app.get('/lecture/:id', locked, validate(schema.uuidParam, 'params'), lectures.getByID);
};

export default lecturesRoutes;
