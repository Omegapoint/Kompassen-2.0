import { DBLecture } from '../../src/lib/types';
import categories from './categories';
import events from './events';
import users from './users';

const date = new Date();
const diffDate = new Date(date.getTime() + 30 * 60000);

const lectures: DBLecture[] = [
  {
    id: '75442486-0878-440c-9db1-a7006c25a39f',
    title: 'Nya funktioner i Azure 2021 Workshop Pecha Kucha',
    description: 'Vi tänker gå igenom lite grejer runt azure med en pecha kucha kanske.',
    lecturer: null,
    lecturerID: null,
    remote: 'distance',
    eventID: null,
    duration: null,
    categoryID: categories[2].id,
    maxParticipants: null,
    requirements: 'Det är bra om man kan moln eller nåt',
    preparations: 'Ha med dig en dator typ.',
    message: null,
    tags: ['cloud', 'azure'],
    createdAt: date,
    createdBy: users[0].id,
    updatedAt: date,
    updatedBy: users[0].id,
    idea: true,
    approved: false,
    draft: false,
    videoLink: null,
    keyTakeaway: null,
    internalPresentation: null,
    lectureStatusID: null,
    formatID: null,
    targetAudience: null,
  },
  {
    id: 'eb976a0f-146d-497d-bf4d-237a7ea79ce2',
    title: 'Är Elixir världens bästa programspråk?',
    description: 'Vi löser den stora frågan, är elixir världens bästa programspråk?',
    lecturer: 'Jonas Sjödin',
    lecturerID: users[0].id,
    eventID: events[1].id,
    duration: 4500,
    remote: 'local',
    categoryID: categories[1].id,
    maxParticipants: 100,
    requirements: 'Det är bra om man kan programmera',
    preparations: 'Ha med dig en dator typ.',
    message: null,
    tags: ['cloud'],
    idea: true,
    createdAt: diffDate,
    createdBy: users[0].id,
    updatedAt: date,
    updatedBy: users[0].id,
    approved: false,
    draft: false,
    videoLink: null,
    keyTakeaway: null,
    internalPresentation: null,
    lectureStatusID: null,
    formatID: null,
    targetAudience: null,
  },
  {
    id: 'eb976a0f-146d-497d-bf4d-237a7ea79ce5',
    title: 'Är Kotlin världens bästa programspråk?',
    description: 'Vi löser den stora frågan, är kotlin världens bästa programspråk?',
    lecturer: 'Mirjam Borén',
    lecturerID: users[1].id,
    remote: 'hybrid',
    eventID: events[1].id,
    duration: 3600,
    categoryID: categories[1].id,
    maxParticipants: 100,
    requirements: 'Det är bra om man kan programmera',
    preparations: 'Ha med dig en dator typ eller nåt.',
    message: 'Måste ha ett rum med projektor',
    tags: ['cloud'],
    idea: true,
    createdAt: date,
    createdBy: users[1].id,
    updatedAt: date,
    updatedBy: users[1].id,
    approved: false,
    draft: false,
    videoLink: null,
    keyTakeaway: null,
    internalPresentation: null,
    lectureStatusID: null,
    formatID: null,
    targetAudience: null,
  },
  {
    id: '64e16eb5-2c8f-4fd8-80e3-d75b0aee9255',
    title: 'Blame driven development',
    description: 'Om det populära alternativet till domain driven development',
    lecturer: 'Emil Lindholm Brandt',
    lecturerID: users[2].id,
    remote: 'distance',
    eventID: events[1].id,
    duration: 3600,
    categoryID: categories[3].id,
    maxParticipants: 100,
    requirements: 'Det är bra om man vet hur man använder `git blame`',
    preparations: 'Ha med dig en dator typ eller nåt.',
    message: 'Måste ha ett rum med projektor',
    tags: ['metodik', 'git'],
    idea: true,
    createdAt: date,
    createdBy: users[1].id,
    updatedAt: date,
    updatedBy: users[1].id,
    approved: true,
    draft: false,
    videoLink: null,
    keyTakeaway: null,
    internalPresentation: null,
    lectureStatusID: null,
    formatID: null,
    targetAudience: null,
  },
  {
    id: 'f546d5da-4128-4cc0-bf0e-b87c55e0b40e',
    title: 'Är Java världens bästa programmeringsspråk?',
    description: 'Svaret är ja, kom och hör varför!',
    lecturer: 'Emil Lindholm Brandt',
    lecturerID: users[2].id,
    remote: 'hybrid',
    eventID: events[1].id,
    duration: 3600,
    categoryID: categories[1].id,
    maxParticipants: 100,
    requirements: 'Objektorienterad programmering',
    preparations: 'Ha med dig en dator typ eller nåt.',
    message: null,
    tags: ['teknik', 'programmering'],
    idea: true,
    createdAt: date,
    createdBy: users[1].id,
    updatedAt: date,
    updatedBy: users[1].id,
    approved: true,
    draft: false,
    videoLink: null,
    keyTakeaway: null,
    internalPresentation: null,
    lectureStatusID: null,
    formatID: null,
    targetAudience: null,
  },
];

export default lectures;
