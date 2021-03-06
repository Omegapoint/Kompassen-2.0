import store from '../reducers';
import { AzureUser } from '../reducers/session/actions';

export async function getAzureGraphSingleUser(path: string): Promise<AzureUser> {
  const accessToken = store.getState().session.graphToken;

  const options = {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };

  return (
    fetch(`https://graph.microsoft.com/v1.0${path}`, options)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error(response.statusText);
      })
      // eslint-disable-next-line no-console
      .catch((error) => console.log(error))
  );
}

export async function getAzureGraphMultipleUsers(
  path: string,
  consistencyLevel = `eventual`
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<any> {
  const accessToken = store.getState().session.graphToken;

  const options = {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      ConsistencyLevel: `${consistencyLevel}`,
    },
  };

  return (
    fetch(`https://graph.microsoft.com/v1.0${path}`, options)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .then((response: any) => response.json())
      // eslint-disable-next-line no-console
      .catch((error) => console.log(error))
  );
}

export async function getMyUser(): Promise<AzureUser> {
  return getAzureGraphSingleUser('/me');
}

export async function getAzureUser(userID: string): Promise<AzureUser> {
  return getAzureGraphSingleUser(`/users/${userID}`);
}

export async function searchAzureUsers(searchString: string): Promise<AzureUser[]> {
  const responseBody = await getAzureGraphMultipleUsers(
    `/users?$filter=startswith(displayName,'${searchString}')&$orderby=displayName&$count=true&$top=5`
  );
  const responseList: AzureUser[] = responseBody.value;
  if (!responseList) {
    return [];
  }
  return responseList;
}
