import { createMuiTheme } from '@material-ui/core';

export const colors = {
  primary: '#286166',
  white: '#FFFFFF',
  orange: '#E87722',
  background: '#F5F4F2',
};

export const fontFamilies = {
  header: 'Roboto Slab',
};

export const padding = {
  medium: '32px',
  standard: '20px',
  small: '15px',
  minimal: '10px',
};

export const theme = createMuiTheme({
  overrides: {
    MuiPaper: {
      root: {
        padding: padding.standard,
      },
    },
  },
  props: {
    MuiPaper: {
      square: true,
    },
    MuiLink: {
      underline: 'none',
    },
  },
  palette: {
    primary: {
      main: colors.primary,
      contrastText: colors.white,
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
    subtitle1: {
      fontSize: '0.9rem',
      fontWeight: 300,
    },
  },
});
