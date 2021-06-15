import React, { ReactElement } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { MuiThemeProvider } from '@material-ui/core';
import Header from './components/header';
import Router from './api/Router';
import Footer from './components/footer';
import { theme } from './theme/theme';
import GlobalStyles from './theme/GlobalStyle';

const App = (): ReactElement => (
  <BrowserRouter>
    <GlobalStyles />
    <MuiThemeProvider theme={theme}>
      <Header />
      <Router />
      <Footer />
    </MuiThemeProvider>
  </BrowserRouter>
);

export default App;
