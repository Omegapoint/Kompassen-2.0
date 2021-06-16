import React, { ReactElement } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { MuiThemeProvider } from '@material-ui/core';
import Header from './components/header/Header';
import Footer from './components/footer/Footer';
import { theme } from './theme/Theme';
import GlobalStyles from './theme/GlobalStyle';
import Body from './components/body/Body';

const App = (): ReactElement => (
  <BrowserRouter>
    <GlobalStyles />
    <MuiThemeProvider theme={theme}>
      <Header />
      <Body />
      <Footer />
    </MuiThemeProvider>
  </BrowserRouter>
);

export default App;
