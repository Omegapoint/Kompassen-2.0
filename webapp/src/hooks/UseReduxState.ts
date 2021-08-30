import { useAppSelector } from '../lib/Lib';
import { Category, Event, Location, Organisation } from '../lib/Types';

export const useEvent = (id: string): Event | undefined => {
  const events = useAppSelector((state) => state.events);
  return events.find((e) => e.id === id)!;
};

export const useOrganisation = (id: string): Organisation | undefined => {
  const organisations = useAppSelector((state) => state.organisations);
  return organisations.find((org) => org.id === id);
};

export const useCategory = (id: string): Category | undefined => {
  const categories = useAppSelector((state) => state.categories);
  return categories.find((cat) => cat.id === id);
};

export const useLocation = (id: string): Location | undefined => {
  const locations = useAppSelector((state) => state.locations);
  return locations.find((loc) => loc.id === id);
};