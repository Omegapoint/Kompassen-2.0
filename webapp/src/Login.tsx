/* eslint-disable no-console */
import { BrowserAuthOptions } from '@azure/msal-browser';
import { Configuration } from '@azure/msal-browser/dist/config/Configuration';

export const genMSALConfig = (loginConfig: BrowserAuthOptions): Configuration => ({
  auth: {
    ...loginConfig,
  },
  cache: {
    cacheLocation: 'sessionStorage',
    storeAuthStateInCookie: false,
  },
  system: {
    loggerOptions: {
      // loggerCallback: (level: LogLevel, message: string, containsPii: boolean): void => {
      //   if (containsPii) return;
      //
      //   if (level === LogLevel.Error) console.error(message);
      //   else if (level === LogLevel.Info) console.info(message);
      //   else if (level === LogLevel.Verbose) console.debug(message);
      //   else if (level === LogLevel.Warning) console.warn(message);
      // },
    },
  },
});

// export const scopes = ['User.Read'];
export const scopes = ['956aafda-ca44-49fd-8de7-144b7ed08054/.default'];

export const loginRequest = {
  scopes,
};

export const graphConfig = {
  graphMeEndpoint: 'https://graph.microsoft.com/v1.0/me',
};

export async function callMsGraph(accessToken: string): Promise<Response> {
  const headers = new Headers();
  const bearer = `Bearer ${accessToken}`;

  headers.append('Authorization', bearer);

  const options = {
    method: 'GET',
    headers,
  };

  return fetch(graphConfig.graphMeEndpoint, options)
    .then((response) => response.json())
    .catch((error) => console.log(error));
}
