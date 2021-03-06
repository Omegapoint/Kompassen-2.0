import { useAppSelector } from '../lib/Lib';
import { Category, Event, Office, Organisation } from '../lib/Types';

export const useEvent = (id: string): Event | undefined => {
  const events = useAppSelector((state) => state.events);
  return events.find((event) => event.id === id)!;
};

export const useOrganisation = (id: string): Organisation | undefined => {
  const organisations = useAppSelector((state) => state.organisations);
  return organisations.find((organisation) => organisation.id === id);
};

export const useCategory = (id: string): Category | undefined => {
  const categories = useAppSelector((state) => state.categories);
  return categories.find((category) => category.id === id);
};

export const useOffice = (id: string): Office | undefined => {
  const offices = useAppSelector((state) => state.offices);
  return offices.find((office) => office.id === id);
};
