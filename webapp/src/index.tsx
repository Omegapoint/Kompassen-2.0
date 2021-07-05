import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { BrowserAuthOptions, PublicClientApplication } from '@azure/msal-browser';
import { MsalProvider } from '@azure/msal-react';
import { BrowserRouter } from 'react-router-dom';
import { MuiThemeProvider } from '@material-ui/core';
import { genMSALConfig } from './Login';
import App from './App';
import GlobalStyles from './theme/GlobalStyle';
import { theme } from './theme/Theme';
import { BASE_HTTP_URL } from './lib/fetch';
import Loader from './components/loader/Loader';

const Index = () => {
  const [loginInfo, setLoginInfo] = useState<null | BrowserAuthOptions>();

  useEffect(() => {
    (async () => {
      const resp = await fetch(`${BASE_HTTP_URL}/login/config`);
      const data = await resp.json();
      setLoginInfo(data);
    })();
  }, []);

  if (!loginInfo) return <Loader />;
  const msalInstance = new PublicClientApplication(genMSALConfig(loginInfo));
  return (
    <MsalProvider instance={msalInstance}>
      <App />
    </MsalProvider>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <GlobalStyles />
      <MuiThemeProvider theme={theme}>
        <Index />
      </MuiThemeProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);
