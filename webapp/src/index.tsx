import { BrowserAuthOptions, PublicClientApplication } from '@azure/msal-browser';
import { MsalProvider } from '@azure/msal-react';
import { Box, Button, StyledEngineProvider, ThemeProvider, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { BASE_HTTP_URL } from './api/Fetch';
import { genMSALConfig } from './api/Login';
import App from './App';
import BigLoader from './components/loader/BigLoader';
import { useAppDispatch } from './lib/Lib';
import store from './reducers';
import { setLoginInfo as setReduxLoginInfo } from './reducers/loginInfo/actions';
import GlobalStyles from './theme/GlobalStyle';
import { padding, theme } from './theme/Theme';

const queryClient = new QueryClient();

const Index = () => {
  const [loginInfo, setLoginInfo] = useState<null | BrowserAuthOptions>();
  const dispatch = useAppDispatch();
  const [error, setError] = useState(false);

  useEffect(() => {
    (async () => {
      const resp = await fetch(`${BASE_HTTP_URL}/login/config`);
      if (resp.status > 400) {
        setError(true);
      }
      const data = await resp.json();
      dispatch(setReduxLoginInfo(data));
      setLoginInfo(data);
    })();
  }, [dispatch]);

  if (error) {
    return (
      <Box
        sx={{
          display: 'grid',
          gridGap: padding.standard,
          justifyItems: 'center',
          alignContent: 'center',
          height: '100vh',
        }}
      >
        <Typography variant="h6">Ett problem har uppstått, testa ladda om sidan.</Typography>
        <Button color="primary" variant="contained" onClick={() => window.location.reload()}>
          Ladda om
        </Button>
      </Box>
    );
  }

  if (!loginInfo) return <BigLoader />;
  const msalInstance = new PublicClientApplication(genMSALConfig(loginInfo));
  return (
    <QueryClientProvider client={queryClient}>
      <MsalProvider instance={msalInstance}>
        <App />
      </MsalProvider>
    </QueryClientProvider>
  );
};

// TODO: This is an ugly redirect fix, please remove this when kompassen2.azurewebsites.net is not used anymore or hidden.
const Redirecter = () => {
  const from = 'kompassen2.azurewebsites.net';
  const to = 'https://kompass.omegapoint.academy/';

  if (window.location.hostname === from) {
    window.location.href = to;
    return null;
  }

  return <Index />;
};

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <GlobalStyles />
        <StyledEngineProvider injectFirst>
          <ThemeProvider theme={theme}>
            <Redirecter />
          </ThemeProvider>
        </StyledEngineProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
