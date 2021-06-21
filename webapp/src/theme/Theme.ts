import { createMuiTheme } from '@material-ui/core';

export const colors = {
  primary: '#286166',
  white: '#FFFFFF',
  orange: '#E87722',
  blue: '#003349',
  grey: '#707070',
  lightGrey: '#C7C6C5',
  background: '#F5F4F2',
  lightBlue: '#E4EBEB',
};

export const fontFamilies = {
  header: 'Roboto Slab',
};

export const constants = {
  headerHeight: '50px',
};

export const borderRadius = {
  small: '6px',
  standard: '10px',
};

export const padding = {
  large: '48px',
  medium: '32px',
  standard: '20px',
  small: '15px',
  minimal: '10px',
};

export const theme = createMuiTheme({
  overrides: {
    MuiButton: {
      root: {
        textTransform: 'none',
        fontWeight: 300,
      },
    },
    MuiRadio: {
      colorSecondary: {
        '&$checked': {
          color: colors.primary,
        },
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
      fontSize: '1.4rem',
      color: colors.primary,
    },
    h2: {
      fontSize: '1.2rem',
      fontWeight: 400,
      color: colors.primary,
    },
    h6: {
      fontSize: '1rem',
    },
    subtitle1: {
      fontSize: '0.9rem',
      fontWeight: 300,
      color: colors.grey,
    },
    body1: {
      fontWeight: 400,
    },
    body2: {
      fontWeight: 300,
      fontStyle: 'italic',
      color: colors.grey,
    },
  },
});
