import { DBLecture } from '../../src/lib/types';
import users from './users';
import events from './events';
import categories from './categories';
import locations from './locations';

const date = new Date();

const lectures: DBLecture[] = [
  {
    id: '75442486-0878-440c-9db1-a7006c25a39f',
    title: 'Nya funktioner i Azure 2021 Workshop Pecha Kucha',
    description: 'Vi tänker gå igenom lite grejer runt azure med en pecha kucha kanske.',
    lecturer: null,
    location: locations[0].name,
    eventID: null,
    duration: null,
    category: categories[0].name,
    maxParticipants: null,
    requirements: 'Det är bra om man kan moln eller nåt',
    preparations: 'Ha med dig en dator typ.',
    tags: ['cloud', 'azure'],
    createdAt: date,
    createdBy: users[2].id,
    updatedAt: date,
    updatedBy: users[2].id,
  },
  {
    id: 'eb976a0f-146d-497d-bf4d-237a7ea79ce6',
    title: 'Är Elixir världens bästa programspråk?',
    description: 'Vi löser den stora frågan, är elixir världens bästa programspråk?',
    lecturer: users[0].name,
    location: locations[0].name,
    eventID: events[1].id,
    duration: 3600,
    category: categories[0].name,
    maxParticipants: 100,
    requirements: 'Det är bra om man kan programmera',
    preparations: 'Ha med dig en dator typ.',
    tags: ['cloud'],
    createdAt: date,
    createdBy: users[2].id,
    updatedAt: date,
    updatedBy: users[2].id,
  },
];

export default lectures;
