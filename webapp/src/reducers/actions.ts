import { createCategory, deleteCategory, setCategories, updateCategory } from './categories';
import { createEvent, deleteEvent, setEvents, updateEvent } from './events/actions';
import { createFormat, deleteFormat, setFormats, updateFormat } from './formats';
import { setLoginInfo } from './loginInfo/actions';
import { createOffice, deleteOffice, setOffice, updateOffice } from './offices';
import {
  createOrganisation,
  deleteOrganisation,
  setOrganisations,
  updateOrganisation,
} from './organisations/actions';
import { setAPIToken, setAzureUser, setGraphToken, setRole, setSocket } from './session/actions';
import { setUser } from './user/actions';

const actions = {
  categories: {
    set: setCategories,
    update: updateCategory,
    delete: deleteCategory,
    create: createCategory,
  },
  offices: {
    set: setOffice,
    update: updateOffice,
    delete: deleteOffice,
    create: createOffice,
  },
  formats: {
    set: setFormats,
    update: updateFormat,
    delete: deleteFormat,
    create: createFormat,
  },
  events: {
    set: setEvents,
    update: updateEvent,
    delete: deleteEvent,
    create: createEvent,
  },
  loginInfo: {
    set: setLoginInfo,
  },
  organisations: {
    set: setOrganisations,
    update: updateOrganisation,
    delete: deleteOrganisation,
    create: createOrganisation,
  },
  session: {
    setSocket,
    setAzureUser,
    setAPIToken,
    setGraphToken,
    setRole,
  },
  user: {
    set: setUser,
  },
};

export default actions;
