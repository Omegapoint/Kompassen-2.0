import { useMsal } from '@azure/msal-react';
import { useEffect, useState } from 'react';
import { getMyUser } from '../api/GraphApi';
import { useAzure } from '../api/Login';
import { useAppDispatch } from '../lib/Lib';
import {
  setAPIToken as setAPITokenRedux,
  setAzureUser,
  setGraphToken as setGraphTokenRedux,
  setRole,
} from '../reducers/session/actions';

interface UseAccessToken {
  loading: boolean;
  apiToken: string;
  graphToken: string;
}

const useAccessToken = (isAuthenticated: boolean): UseAccessToken => {
  const { instance, accounts } = useMsal();
  const [apiToken, setAPIToken] = useState('');
  const [graphToken, setGraphToken] = useState('');
  const dispatch = useAppDispatch();
  const { loginRequest } = useAzure();

  useEffect(() => {
    if (isAuthenticated) {
      const getGraphToken = async () => {
        if (accounts.length) {
          try {
            const resp = await instance.acquireTokenSilent({
              scopes: ['User.ReadBasic.All'],
              account: accounts[0],
            });
            if (!resp.accessToken) return;

            dispatch(setGraphTokenRedux(resp.accessToken));
            const azureUser = await getMyUser();

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            if (!azureUser || (azureUser as any).error) {
              await new Promise((e) => setTimeout(e, 1000));
              await getGraphToken();
              return;
            }
            dispatch(setAzureUser(azureUser));
            setGraphToken(resp.accessToken);
          } catch (e) {
            await getGraphToken();
          }
        }
      };

      const getToken = async () => {
        if (accounts.length) {
          try {
            const resp = await instance.acquireTokenSilent({
              ...loginRequest,
              account: accounts[0],
            });
            dispatch(setAPITokenRedux(resp.accessToken));
            setAPIToken(resp.accessToken);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const claims = resp.idTokenClaims as any;
            const role = claims.roles ? claims.roles[0] : 'Worker';
            dispatch(setRole(role));
          } catch (e) {
            await instance.logoutPopup({ postLogoutRedirectUri: '/', mainWindowRedirectUri: '/' });
          }
        }
        await getGraphToken();
      };

      getToken();
      const timerID = setInterval(getToken, 60 * 1000);
      return () => clearInterval(timerID);
    }
    return () => {};
  }, [accounts, dispatch, instance, isAuthenticated, loginRequest]);

  return { loading: !(apiToken && graphToken), apiToken, graphToken };
};

export default useAccessToken;
