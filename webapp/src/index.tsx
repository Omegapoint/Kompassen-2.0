import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { BrowserAuthOptions, PublicClientApplication } from '@azure/msal-browser';
import { MsalProvider } from '@azure/msal-react';
import { MuiThemeProvider } from '@material-ui/core';
import { genMSALConfig } from './Login';
import App from './App';
import GlobalStyles from './theme/GlobalStyle';
import { theme } from './theme/Theme';
import { BASE_HTTP_URL } from './lib/Fetch';
import BigLoader from './components/loader/BigLoader';
import store from './reducers';

const Index = () => {
  const [loginInfo, setLoginInfo] = useState<null | BrowserAuthOptions>();

  useEffect(() => {
    (async () => {
      const resp = await fetch(`${BASE_HTTP_URL}/login/config`);
      const data = await resp.json();
      setLoginInfo(data);
    })();
  }, []);

  if (!loginInfo) return <BigLoader />;
  const msalInstance = new PublicClientApplication(genMSALConfig(loginInfo));
  return (
    <MsalProvider instance={msalInstance}>
      <App />
    </MsalProvider>
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
