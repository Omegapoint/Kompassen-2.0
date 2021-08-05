import { useIsAuthenticated, useMsal } from '@azure/msal-react';
import { ReactElement } from 'react';
import BigLoader from './components/loader/BigLoader';
import ContentWrapper from './Content';
import useAccessToken from './hooks/UseAccessToken';
import { useAppSelector } from './lib/Lib';
import GreetingPage from './section/landing/GreetingPage';
import LoginPage from './section/landing/LoginPage';

const App = (): ReactElement => {
  const isAuthenticated = useIsAuthenticated();
  const { loading } = useAccessToken(isAuthenticated);
  const { inProgress } = useMsal();
  const { apiToken } = useAppSelector((state) => state.session);

  if (!isAuthenticated && inProgress === 'none') {
    return (
      <GreetingPage>
        <LoginPage />
      </GreetingPage>
    );
  }

  if (loading || !apiToken) {
    return <BigLoader />;
  }

  return <ContentWrapper />;
};

export default App;
