import { BrowserAuthOptions, PublicClientApplication } from '@azure/msal-browser';
import { MsalProvider } from '@azure/msal-react';
import { Button, makeStyles, MuiThemeProvider, Typography } from '@material-ui/core';
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

const useStyles = makeStyles(() => ({
  container: {
    display: 'grid',
    gridGap: padding.standard,
    justifyItems: 'center',
    alignContent: 'center',
    height: '100vh',
  },
}));

const Index = () => {
  const [loginInfo, setLoginInfo] = useState<null | BrowserAuthOptions>();
  const dispatch = useAppDispatch();
  const [error, setError] = useState(false);
  const classes = useStyles();

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
      <div className={classes.container}>
        <Typography variant="h6">Ett problem har uppstått, testa ladda om sidan.</Typography>
        <Button color="primary" variant="contained" onClick={() => window.location.reload()}>
          Ladda om
        </Button>
      </div>
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

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <GlobalStyles />
        <MuiThemeProvider theme={theme}>
          <Index />
        </MuiThemeProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
