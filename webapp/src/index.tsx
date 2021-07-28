import { BrowserAuthOptions, PublicClientApplication } from '@azure/msal-browser';
import { MsalProvider } from '@azure/msal-react';
import { MuiThemeProvider } from '@material-ui/core';
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
import { theme } from './theme/Theme';

const queryClient = new QueryClient();

const Index = () => {
  const [loginInfo, setLoginInfo] = useState<null | BrowserAuthOptions>();
  const dispatch = useAppDispatch();

  useEffect(() => {
    (async () => {
      const resp = await fetch(`${BASE_HTTP_URL}/login/config`);
      const data = await resp.json();
      dispatch(setReduxLoginInfo(data));
      setLoginInfo(data);
    })();
  }, [dispatch]);

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
