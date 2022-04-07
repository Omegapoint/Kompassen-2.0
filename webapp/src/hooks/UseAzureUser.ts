import { useQuery } from 'react-query';
import { getAzureUser } from '../api/GraphApi';

interface IUseAzureUser {
  error: unknown;
  isLoading: boolean;
  name?: string;
  initials: string;
}

const useAzureUser = (id: string): IUseAzureUser => {
  const { error, data, isLoading } = useQuery(`azureUser-${id}`, () => getAzureUser(id));
  return {
    error,
    isLoading,
    name: isLoading ? 'Laddar' : data?.displayName,
    initials: isLoading ? '' : `${data?.givenName[0]}${data?.surname[0]}`,
  };
};

export default useAzureUser;
