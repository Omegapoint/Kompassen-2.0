import { sub } from 'date-fns';
import { Category } from '../../src/lib/types';
import users from './users';

const date = new Date();

const cloudIcon = `
<svg xmlns='http://www.w3.org/2000/svg' width='100%' height='100%' viewBox='0 0 19.181 11.305'>
    <path id='Icon_awesome-cloud'
          d='M16.111,7.161a2.1,2.1,0,0,0,.192-.873,2.68,2.68,0,0,0-2.877-2.423,3.255,3.255,0,0,0-1.6.409A5.009,5.009,0,0,0,7.672,2.25c-2.649,0-4.8,1.807-4.8,4.038,0,.068,0,.136.006.2A3.739,3.739,0,0,0,0,9.921c0,2.006,1.933,3.634,4.316,3.634H15.344c2.119,0,3.836-1.446,3.836-3.23A3.426,3.426,0,0,0,16.111,7.161Z'
          transform='translate(0 -2.25)' fill='#f9bc2e'/>
</svg>
`;

const codeIcon = `
<svg xmlns='http://www.w3.org/2000/svg' width='100%' height='100%' viewBox='0 0 20.841 16.67'>
    <path id='Icon_awesome-code'
          d='M9.08,16.656,7.094,16.08a.391.391,0,0,1-.267-.485L11.272.285a.391.391,0,0,1,.485-.267l1.986.576a.391.391,0,0,1,.267.485L9.565,16.389a.39.39,0,0,1-.485.267ZM5.368,13l1.416-1.511a.391.391,0,0,0-.026-.56l-2.95-2.6,2.95-2.6a.388.388,0,0,0,.026-.56L5.368,3.671a.391.391,0,0,0-.554-.016L.123,8.05a.388.388,0,0,0,0,.57l4.692,4.4A.388.388,0,0,0,5.368,13Zm10.654.02,4.692-4.4a.388.388,0,0,0,0-.57l-4.692-4.4a.394.394,0,0,0-.554.016L14.052,5.179a.391.391,0,0,0,.026.56l2.95,2.6-2.95,2.6a.388.388,0,0,0-.026.56L15.469,13a.391.391,0,0,0,.554.02Z'
          transform='translate(0.002 -0.003)' fill='#6fa5a9'/>
</svg>
`;

const shieldIcon = `
<svg xmlns='http://www.w3.org/2000/svg' width='100%' height='100%' viewBox='0 0 14.656 17.913'>
    <path id='Icon_material-security'
          d='M11.828,1.5,4.5,4.757V9.642a10.133,10.133,0,0,0,7.328,9.771,10.133,10.133,0,0,0,7.328-9.771V4.757Zm0,8.948h5.7a8.716,8.716,0,0,1-5.7,7.279V10.457h-5.7V5.815l5.7-2.532Z'
          transform='translate(-4.5 -1.5)' fill='#e87722'/>
</svg>
`;

const sunIcon = `
<svg xmlns='http://www.w3.org/2000/svg' width='100%' height='100%' viewBox='0 0 18 18'>
    <path id='Icon_simple-sentiayoga'
          d='M9,15.213a13.054,13.054,0,0,1-1.48,1.063A7.7,7.7,0,0,0,9,18a7.684,7.684,0,0,0,1.481-1.723A12.818,12.818,0,0,1,9,15.213Zm4.86-2.23A8.547,8.547,0,0,1,13.5,16.8,8.526,8.526,0,0,1,10.024,15.2a6.292,6.292,0,0,0,3.836-2.219Zm-9.72,0A6.289,6.289,0,0,0,7.976,15.2,8.526,8.526,0,0,1,4.5,16.8a8.542,8.542,0,0,1-.36-3.81Zm9.253-.47a5.63,5.63,0,0,1-3.549,2.05,14.115,14.115,0,0,0,1.442-1.6,14.282,14.282,0,0,0,2.107-.448Zm-8.786,0a14.079,14.079,0,0,0,2.107.447,14.006,14.006,0,0,0,1.442,1.6,5.619,5.619,0,0,1-3.549-2.05Zm2.45-6.878A14.69,14.69,0,0,1,9,3.5a14.681,14.681,0,0,1,1.943,2.135,14.752,14.752,0,0,1,2.822.615A14.988,14.988,0,0,1,12.887,9a14.933,14.933,0,0,1,.878,2.751,14.818,14.818,0,0,1-2.822.615A14.8,14.8,0,0,1,9,14.5a14.681,14.681,0,0,1-1.943-2.135,14.752,14.752,0,0,1-2.822-.615A14.987,14.987,0,0,1,5.113,9a14.933,14.933,0,0,1-.878-2.751,14.819,14.819,0,0,1,2.821-.615Zm-5.1,5.721A7.749,7.749,0,0,0,1.206,13.5a7.719,7.719,0,0,0,2.233.421,12.622,12.622,0,0,1,.18-1.815,12.417,12.417,0,0,1-1.661-.749Zm14.085,0a12.727,12.727,0,0,1-1.662.75,12.654,12.654,0,0,1,.18,1.816,7.757,7.757,0,0,0,2.233-.421,7.685,7.685,0,0,0-.754-2.144ZM14.884,6.784A8.528,8.528,0,0,1,18,9a8.528,8.528,0,0,1-3.116,2.216,6.324,6.324,0,0,0,0-4.433Zm-11.768,0a6.324,6.324,0,0,0,0,4.433A8.533,8.533,0,0,1,0,9,8.528,8.528,0,0,1,3.116,6.784Zm11.123.165a5.643,5.643,0,0,1,0,4.1A14.177,14.177,0,0,0,13.572,9a14.177,14.177,0,0,0,.667-2.051Zm-10.478,0A14.177,14.177,0,0,0,4.428,9a14.177,14.177,0,0,0-.667,2.051,5.643,5.643,0,0,1,0-4.1ZM3.439,4.08a7.757,7.757,0,0,0-2.233.42A7.685,7.685,0,0,0,1.96,6.644a12.7,12.7,0,0,1,1.659-.75,12.654,12.654,0,0,1-.18-1.816Zm11.122,0a12.624,12.624,0,0,1-.18,1.813,12.417,12.417,0,0,1,1.661.749A7.749,7.749,0,0,0,16.793,4.5a7.719,7.719,0,0,0-2.233-.421ZM9.844,3.439a5.616,5.616,0,0,1,3.549,2.048,14.22,14.22,0,0,0-2.107-.445,14.006,14.006,0,0,0-1.442-1.6Zm-1.687,0a14.006,14.006,0,0,0-1.442,1.6,14.282,14.282,0,0,0-2.107.448,5.629,5.629,0,0,1,3.549-2.05ZM10.024,2.8A8.526,8.526,0,0,1,13.5,1.206a8.542,8.542,0,0,1,.36,3.81A6.289,6.289,0,0,0,10.024,2.8ZM4.14,5.017A8.557,8.557,0,0,1,4.5,1.2,8.526,8.526,0,0,1,7.976,2.8,6.292,6.292,0,0,0,4.14,5.014Zm6.342-3.3A7.774,7.774,0,0,0,9,0,7.684,7.684,0,0,0,7.52,1.723,12.817,12.817,0,0,1,9,2.787a13.054,13.054,0,0,1,1.481-1.063Z'
          fill='#7bac53'/>
</svg>
`;

const vcsIcon = `
<svg xmlns='http://www.w3.org/2000/svg' width='100%' height='100%' viewBox='0 0 21.04 15.549'>
    <path id='Icon_metro-versions'
          d='M0,11.6H2.9V10.154H1.451v-5.8H2.9V2.9H0v8.7ZM8.7,0V14.506h11.6V0H8.7Zm8.7,11.6H11.6V2.9h5.8ZM4.352,13.055h2.9V11.6H5.8V2.9H7.253V1.451h-2.9Z'
          transform='matrix(0.999, -0.052, 0.052, 0.999, 0, 1.063)' fill='#967ecc'/>
</svg>
`;

const locations: Category[] = [
  {
    id: '38f265ef-14f5-4ee9-aa8e-bcf2e2fd2e3e',
    name: 'Molnbaserat',
    icon: cloudIcon,
    color: '#F9BC2E',
    createdAt: sub(date, { months: 1 }),
    createdBy: users[0].id,
    updatedAt: sub(date, { months: 1 }),
    updatedBy: users[0].id,
  },
  {
    id: '71c73381-68ed-4541-ae8f-04c68934e10f',
    name: 'Utveckling',
    icon: codeIcon,
    color: '#6FA5A9',
    createdAt: sub(date, { days: 1 }),
    createdBy: users[0].id,
    updatedAt: sub(date, { days: 1 }),
    updatedBy: users[0].id,
  },
  {
    id: 'b3b7b6b1-48ed-424a-9ecd-ec6bdce91cfd',
    name: 'Säkerhet',
    icon: shieldIcon,
    color: '#E87722',
    createdAt: sub(date, { years: 1 }),
    createdBy: users[0].id,
    updatedAt: sub(date, { years: 1 }),
    updatedBy: users[0].id,
  },
  {
    id: '8767533d-ae63-4781-be53-8e0cc36206ab',
    name: 'Mjukt spår',
    icon: sunIcon,
    color: '#7BAC53',
    createdAt: sub(date, { days: 2 }),
    createdBy: users[0].id,
    updatedAt: sub(date, { days: 2 }),
    updatedBy: users[0].id,
  },
  {
    id: 'c8a3e1b1-1449-42e7-ba78-47fada2e739f',
    name: 'Versionshantering',
    icon: vcsIcon,
    color: '#967ECC',
    createdAt: sub(date, { weeks: 1 }),
    createdBy: users[0].id,
    updatedAt: sub(date, { weeks: 1 }),
    updatedBy: users[0].id,
  },
];

export default locations;
