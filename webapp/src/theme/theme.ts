import { createMuiTheme } from '@material-ui/core';

export const colors = {
  primary: '#286166',
  white: '#FFFFFF',
  background: '#F5F4F2',
};

export const fontFamilies = {
  header: 'Roboto Slab',
};

export const padding = {
  standard: '20px',
};

export const theme = createMuiTheme({
  palette: {
    primary: {
      main: colors.primary,
    },
    secondary: {
      main: colors.white,
      contrastText: colors.primary,
    },
  },
  typography: {
    h1: {
      fontFamily: fontFamilies.header,
    },
  },
});
