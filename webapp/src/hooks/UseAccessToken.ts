import { useMsal } from '@azure/msal-react';
import { useEffect, useState } from 'react';
import { getMyUser } from '../api/GraphApi';
import { useAzure } from '../api/Login';
import { useAppDispatch } from '../lib/Lib';
import {
  setAPIToken as setAPITokenRedux,
  setAzureUser,
  setGraphToken as setGraphTokenRedux,
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
      const getToken = async () => {
        if (accounts.length) {
          const resp = await instance.acquireTokenSilent({ ...loginRequest, account: accounts[0] });
          dispatch(setAPITokenRedux(resp.accessToken));
          setAPIToken(resp.accessToken);
        }
      };

      getToken();
      const timerID = setInterval(getToken, 10 * 60 * 1000);
      return () => clearInterval(timerID);
    }
    return () => {};
  }, [accounts, dispatch, instance, isAuthenticated, loginRequest]);

  useEffect(() => {
    if (isAuthenticated) {
      const getToken = async () => {
        if (accounts.length) {
          const resp = await instance.acquireTokenSilent({
            scopes: ['User.ReadBasic.All'],
            account: accounts[0],
          });
          dispatch(setGraphTokenRedux(resp.accessToken));
          const azureUser = await getMyUser();
          dispatch(setAzureUser(azureUser));
          setGraphToken(resp.accessToken);
        }
      };
      getToken();
      const timerID = setInterval(getToken, 10 * 60 * 1000);
      return () => clearInterval(timerID);
    }
    return () => {};
  }, [accounts, dispatch, instance, isAuthenticated]);

  return { loading: !(apiToken && graphToken), apiToken, graphToken };
};

export default useAccessToken;
