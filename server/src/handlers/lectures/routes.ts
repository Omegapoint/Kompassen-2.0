import { Express } from 'express';
import { admin, locked } from '../auth';
import schema, { validate } from '../validationSchemas';
import lectures from './handlers';

const lecturesRoutes = (app: Express): void => {
  app.post('/lecture', locked, validate(schema.lectures.newLecture), lectures.create);
  app.post('/lecture/approve', admin, validate(schema.lectures.approve), lectures.approve);
  app.post('/lecture/idea', locked, validate(schema.lectures.newIdea), lectures.createIdea);
  app.put('/lecture/idea', locked, validate(schema.lectures.updatedIdea), lectures.updateIdea);
  app.put('/lecture', locked, validate(schema.lectures.updateLecture), lectures.update);
  app.delete('/lecture/:id', admin, validate(schema.uuidParam, 'params'), lectures.delete);
  app.get('/lecture/tag', locked, lectures.listTags);
  app.get(
    '/lecture/:id/category',
    locked,
    validate(schema.uuidParam, 'params'),
    lectures.listCategories
  );
  app.get('/lecture', locked, validate(schema.lectures.listLectures, 'query'), lectures.list);
  app.get('/lecture/:id', locked, validate(schema.uuidParam, 'params'), lectures.getByID);
};

export default lecturesRoutes;
