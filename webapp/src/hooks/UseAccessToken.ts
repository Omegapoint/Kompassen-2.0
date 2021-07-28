import { useMsal } from '@azure/msal-react';
import { useEffect, useState } from 'react';
import { useAzure } from '../api/Login';
import { useAppDispatch } from '../lib/Lib';
import { setToken as setTokenRedux } from '../reducers/session/actions';

interface UseAccessToken {
  loading: boolean;
  token: string;
}

const useAccessToken = (isAuthenticated: boolean): UseAccessToken => {
  const { instance, accounts } = useMsal();
  const [token, setToken] = useState('');
  const dispatch = useAppDispatch();
  const { loginRequest, logoutRequest } = useAzure();

  // const [graphData, setGraphData] = useState(null);

  useEffect(() => {
    const getToken = () => {
      if (accounts.length) {
        instance
          .acquireTokenSilent({ ...loginRequest, account: accounts[0] })
          .then((response) => {
            dispatch(setTokenRedux(token));
            setToken(response.accessToken);
            // callMsGraph(response.accessToken).then(setGraphData);
          })
          .catch((e) => {
            // eslint-disable-next-line no-console
            console.log(e);
            instance.logoutPopup(logoutRequest);
          });
      }
    };

    if (isAuthenticated) {
      getToken();
      const timerID = setInterval(getToken, 10 * 60 * 1000);
      return () => clearInterval(timerID);
    }
    return () => {};
  }, [accounts, dispatch, instance, isAuthenticated, loginRequest, logoutRequest, token]);

  return { loading: !token, token };
};

export default useAccessToken;
