import { useMsal } from '@azure/msal-react';
import { useEffect, useState } from 'react';
import { loginRequest } from '../Login';

interface UseAccessToken {
  loading: boolean;
  token: string;
}

const useAccessToken = (): UseAccessToken => {
  const { instance, accounts } = useMsal();
  const [token, setToken] = useState('');
  // const [graphData, setGraphData] = useState(null);

  useEffect(() => {
    const getToken = () => {
      if (accounts.length) {
        instance.acquireTokenSilent({ ...loginRequest, account: accounts[0] }).then((response) => {
          sessionStorage.accessToken = response.accessToken;
          setToken(response.accessToken);
          // callMsGraph(response.accessToken).then(setGraphData);
        });
      }
    };

    const timerID = setInterval(getToken, 10 * 60 * 1000);
    getToken();

    return () => clearInterval(timerID);
  }, [accounts, instance]);

  return { loading: !token, token };
};

export default useAccessToken;
