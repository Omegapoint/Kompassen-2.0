import { useIsAuthenticated, useMsal } from '@azure/msal-react';
import { ReactElement, useEffect, useState } from 'react';
import { userExists } from './api/Api';
import BigLoader from './components/loader/BigLoader';
import Content from './Content';
import useAccessToken from './hooks/UseAccessToken';
import { useAppSelector } from './lib/Lib';
import CreateUser from './section/landing/CreateUser';
import GreetingPage from './section/landing/GreetingPage';
import LoginPage from './section/landing/LoginPage';

const App = (): ReactElement => {
  const isAuthenticated = useIsAuthenticated();
  const { loading } = useAccessToken(isAuthenticated);
  const { inProgress } = useMsal();
  const { apiToken } = useAppSelector((state) => state.session);
  const [finished, setFinished] = useState(false);
  const [notExists, setNotExists] = useState(false);
  const unauthenticated = !isAuthenticated && inProgress === 'none';
  const userDoesNotExist = notExists && !finished;

  useEffect(() => {
    (async () => {
      if (!loading && apiToken) {
        const resp = await userExists();
        if (resp.ok) {
          setFinished(true);
        } else {
          setNotExists(true);
        }
      }
    })();
  }, [apiToken, loading]);

  if (unauthenticated) {
    return (
      <GreetingPage>
        <LoginPage />
      </GreetingPage>
    );
  }

  if (userDoesNotExist) {
    return (
      <GreetingPage>
        <CreateUser onFinish={() => setFinished(true)} />
      </GreetingPage>
    );
  }

  if (!finished) {
    return <BigLoader />;
  }

  return <Content />;
};

export default App;
