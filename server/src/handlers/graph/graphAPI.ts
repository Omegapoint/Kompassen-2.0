import { AxiosError } from 'axios';
import config from '../../config/config';
import { AzureUserBasic } from '../../lib/types';

const axios = require('axios').default;

interface AzureUser {
  '@odata.context': string;
  '@odata.id': string;
  businessPhones: string[];
  displayName: string;
  givenName: string;
  jobTitle: string;
  mail: string;
  mobilePhone: string;
  officeLocation: string;
  preferredLanguage: string;
  surname: string;
  userPrincipalName: string;
  id: string;
}

const { clientID, tenantIDOP, tenantIDIBMB, tenantIDElicit, appRegistrationSecret } =
  config.oidc.azure;

async function getAzureGraphSingleUser(
  path: string,
  bearerToken: string
): Promise<AzureUser | null> {
  const response = await axios
    .get(`https://graph.microsoft.com/v1.0${path}`, {
      headers: { Authorization: `Bearer ${bearerToken}` },
    })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .catch((error: any) => {
      const err = error as AxiosError;
      // eslint-disable-next-line no-console
      console.log(err.response?.data);
    });

  if (axios.isAxiosError(response)) {
    const err = response as AxiosError;
    // eslint-disable-next-line no-console
    console.log(err.response?.data);
  } else if (response !== undefined) {
    return response.data;
  }
  return null;
}

async function getAccessToken(tentantID: string): Promise<string | null> {
  const params = new URLSearchParams();
  params.append('client_id', clientID);
  params.append('scope', 'https://graph.microsoft.com/.default');
  params.append('client_secret', appRegistrationSecret);
  params.append('grant_type', 'client_credentials');

  const response = await axios
    .post(`https://login.microsoftonline.com/${tentantID}/oauth2/v2.0/token`, params)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .catch((error: any) => {
      const err = error as AxiosError;
      // eslint-disable-next-line no-console
      console.log(err.response?.data);
    });

  if (axios.isAxiosError(response)) {
    const err = response as AxiosError;
    // eslint-disable-next-line no-console
    console.log(err.response?.data);
  } else {
    return response.data.access_token;
  }
  return null;
}

export async function getAzureUser(userID: string): Promise<AzureUserBasic | null> {
  const tenantIDList = [tenantIDOP, tenantIDIBMB, tenantIDElicit];
  let result: AzureUserBasic | null = null;
  /* eslint-disable no-await-in-loop */
  for (const tenantID of tenantIDList) {
    const accessToken = await getAccessToken(tenantID);
    if (accessToken !== null) {
      const azureUserResult = await getAzureGraphSingleUser(`/users/${userID}`, accessToken);
      if (azureUserResult !== null) {
        result = { name: azureUserResult.displayName, email: azureUserResult.mail };
        break;
      }
    }
  }
  /* eslint-enable no-await-in-loop */
  return result;
}
