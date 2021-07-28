import { createTheme } from '@material-ui/core';

export const colors = {
  primary: '#286166',
  white: '#FFFFFF',
  orange: '#E87722',
  blue: '#003349',
  grey: '#707070',
  lightGrey: '#C7C6C5',
  veryLightGrey: '#E1E1E1',
  background: '#F5F4F2',
  lightBlue: '#E4EBEB',
  darkGrey: '#AFAFAF',
  black: '#000000DE',
  lightGreen: '#7BAC53',
  darkOrange: '#E87722',
  teal: '#6FA5A9',
  darkTeal: '#406676',
  yellow: '#F9BC2E',
  purple: '#967ECC',
  darkGreen: '#2B4A4E',
};

export const fontFamilies = {
  header: 'Roboto Slab',
};

export const constants = {
  headerHeight: '50px',
};

export const borderRadius = {
  tiny: '3px',
  small: '6px',
  standard: '10px',
};

export const padding = {
  large: '48px',
  medium: '32px',
  standard: '20px',
  small: '15px',
  minimal: '10px',
  tiny: '5px',
};

export const theme = createTheme({
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
    MuiSwitch: {
      switchBase: {
        color: colors.darkGrey,
      },
      track: {
        opacity: 0.6,
        backgroundColor: colors.darkGrey,
        '$checked$checked + &': {
          opacity: 0.6,
          backgroundColor: colors.primary,
        },
      },
      colorSecondary: {
        // Controls checked color for the thumb
        '&$checked': {
          color: colors.primary,
        },
      },
    },
    MuiDivider: {
      root: {
        backgroundColor: colors.primary,
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
    h5: {
      fontSize: '1.1rem',
      fontWeight: 500,
    },
    h6: {
      fontSize: '0.9rem',
    },
    subtitle1: {
      fontSize: '0.9rem',
      fontWeight: 300,
      color: colors.grey,
    },
    body1: {
      fontSize: '0.86rem',
      fontWeight: 400,
    },
    body2: {
      fontWeight: 300,
      fontStyle: 'italic',
      color: colors.grey,
    },
  },
});
