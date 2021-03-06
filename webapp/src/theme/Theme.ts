import { createTheme } from '@mui/material';

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
  teal: '#6FA5A9',
  darkTeal: '#406676',
  yellow: '#F9BC2E',
  purple: '#967ECC',
  darkGreen: '#2B4A4E',
  red: '#C16060',
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
  xlarge: '96px',
  large: '48px',
  medium: '32px',
  standard: '20px',
  small: '15px',
  minimal: '10px',
  tiny: '5px',
};

export const theme = createTheme({
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
      defaultProps: {},
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          backgroundColor: colors.primary,
        },
      },
    },
    MuiLink: {
      defaultProps: {
        underline: 'none',
      },
    },
    MuiList: {
      defaultProps: {
        disablePadding: true,
      },
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          alignItems: 'center',
        },
      },
    },
    MuiPaper: {
      defaultProps: {
        square: true,
      },
    },
    MuiRadio: {
      styleOverrides: {
        colorSecondary: {
          '&$checked': {
            color: colors.primary,
          },
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
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
          '&$checked': {
            color: colors.primary,
          },
        },
      },
    },
  },
  palette: {
    primary: {
      main: colors.primary,
      contrastText: colors.white,
    },
    secondary: {
      main: colors.white, //  TODO: Change to Orange, check where it's used (GreetingPage, Navbar)
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
      color: colors.primary,
    },
    h4: {
      fontSize: '1.4rem',
    },
    h5: {
      fontSize: '1.1rem',
    },
    h6: {
      fontSize: '0.9rem',
    },
    subtitle1: {
      fontSize: '0.9rem',
      color: colors.grey,
    },
    body1: {
      fontSize: '0.86rem',
    },
    body2: {
      fontStyle: 'italic',
      color: colors.grey,
    },
  },
});
