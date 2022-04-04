import { Office } from '../../src/lib/types';
import users from './users';

const date = new Date();

const offices: Office[] = [
  {
    id: 'cccb273a-2ae3-4551-8d2c-3fd209aec5e5',
    name: 'Omegapoint Group',
    createdAt: date,
    createdBy: users[0].id,
    updatedAt: date,
    updatedBy: users[0].id,
  },
  {
    id: '6ff57b3b-0149-45f3-9544-24c69ab65cf1',
    name: 'Omegapoint Stockholm',
    createdAt: date,
    createdBy: users[0].id,
    updatedAt: date,
    updatedBy: users[0].id,
  },
  {
    id: '652b8b34-d83b-479c-b795-fbcfc035946e',
    name: 'Omegapoint Umeå',
    createdAt: date,
    createdBy: users[0].id,
    updatedAt: date,
    updatedBy: users[0].id,
  },
  {
    id: '7dc62022-5aed-4590-9a4f-a9520fcb4efd',
    name: 'Omegapoint Malmö',
    createdAt: date,
    createdBy: users[0].id,
    updatedAt: date,
    updatedBy: users[0].id,
  },
  {
    id: '1d7214e6-1487-4e2f-980e-ea12d090c7eb',
    name: 'Omegapoint Göteborg',
    createdAt: date,
    createdBy: users[0].id,
    updatedAt: date,
    updatedBy: users[0].id,
  },
  {
    id: 'd8706225-df9b-49a8-9f97-fcc92cddc558',
    name: 'Omegapoint Uppsala',
    createdAt: date,
    createdBy: users[0].id,
    updatedAt: date,
    updatedBy: users[0].id,
  },
  {
    id: '91adb151-e047-468e-9d06-e6e37589fa2f',
    name: 'Omegapoint Köpenhamn',
    createdAt: date,
    createdBy: users[0].id,
    updatedAt: date,
    updatedBy: users[0].id,
  },
  {
    id: '35c9cd57-c909-4ab7-9aa2-78f3ba957c26',
    name: 'Integrationsbolaget',
    createdAt: date,
    createdBy: users[0].id,
    updatedAt: date,
    updatedBy: users[0].id,
  },
  {
    id: '76cc967f-35ed-4d7a-ad2e-4830d98bdf79',
    name: 'Molnbolaget',
    createdAt: date,
    createdBy: users[0].id,
    updatedAt: date,
    updatedBy: users[0].id,
  },
  {
    id: 'de3801d5-acd2-4bc8-a9fd-6953f5ebe235',
    name: 'Innovate Security',
    createdAt: date,
    createdBy: users[0].id,
    updatedAt: date,
    updatedBy: users[0].id,
  },
  {
    id: 'e4409858-3aa6-4284-a464-2beef6ea8cc9',
    name: 'Elicit',
    createdAt: date,
    createdBy: users[0].id,
    updatedAt: date,
    updatedBy: users[0].id,
  },
];

export default offices;
