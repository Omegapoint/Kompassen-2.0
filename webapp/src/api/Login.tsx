import { BrowserAuthOptions } from '@azure/msal-browser';
import { Configuration } from '@azure/msal-browser/dist/config/Configuration';
import { EndSessionPopupRequest } from '@azure/msal-browser/dist/request/EndSessionPopupRequest';
import { PopupRequest } from '@azure/msal-browser/dist/request/PopupRequest';
import { useState } from 'react';
import { useAppSelector } from '../lib/Lib';

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

interface IUseAzure {
  scopes: string[];
  loginRequest: PopupRequest;
  logoutRequest: EndSessionPopupRequest;
}

export const useAzure = (): IUseAzure => {
  const loginInfo = useAppSelector((state) => state.loginInfo);
  const [scopes] = useState([`${loginInfo.clientId}/.default`]);
  const [loginRequest] = useState({ scopes });
  const [logoutRequest] = useState({ postLogoutRedirectUri: '/', mainWindowRedirectUri: '/' });
  return { scopes, loginRequest, logoutRequest };
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

  return (
    fetch(graphConfig.graphMeEndpoint, options)
      .then((response) => response.json())
      // eslint-disable-next-line no-console
      .catch((error) => console.log(error))
  );
}
