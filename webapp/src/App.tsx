import { useIsAuthenticated, useMsal } from '@azure/msal-react';
import { Box, Typography } from '@mui/material';
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
  const [forbidden, setForbidden] = useState(false);

  useEffect(() => {
    (async () => {
      if (!loading && apiToken) {
        try {
          const resp = await userExists();
          if (resp.ok) {
            setFinished(true);
          } else {
            setNotExists(true);
          }
        } catch (e) {
          setForbidden(true);
        }
      }
    })();
  }, [apiToken, loading]);

  // TODO: This is only here temporary to restrict some users from having access to the site.
  if (forbidden)
    return (
      <Box
        sx={{
          display: 'grid',
          alignItems: 'center',
          justifyItems: 'center',
        }}
      >
        <Typography variant="h1">Kunde tyvärr inte logga in.</Typography>
        <Typography variant="h1">
          Kontrollera med din admin om du ska ha tillåtelse att logga in.
        </Typography>
      </Box>
    );

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
