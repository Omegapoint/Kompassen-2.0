import store from '../reducers';
import { AzureUser } from '../reducers/session/actions';

export async function getAzureGraph(path: string): Promise<AzureUser> {
  const accessToken = store.getState().session.graphToken;

  const options = {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };

  return (
    fetch(`https://graph.microsoft.com/v1.0${path}`, options)
      .then((response) => response.json())
      // eslint-disable-next-line no-console
      .catch((error) => console.log(error))
  );
}

export async function getMyUser(): Promise<AzureUser> {
  return getAzureGraph('/me');
}

export async function getAzureUser(userID: string): Promise<AzureUser> {
  return getAzureGraph(`/users/${userID}`);
}
