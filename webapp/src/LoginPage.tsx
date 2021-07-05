import React, { ReactElement } from 'react';
import { Button, makeStyles, Theme, Typography } from '@material-ui/core';
import { useMsal } from '@azure/msal-react';
import loginBg from './assets/loginBg.svg';
import { colors, fontFamilies, padding } from './theme/Theme';
import { loginRequest } from './Login';

interface StyleProps {
  image: string;
}

const useStyles = makeStyles<Theme, StyleProps>(() => ({
  container: {
    display: 'grid',
    gridTemplateColumns: '1fr 2fr',
    height: '100vh',
  },
  image: {
    background: ({ image }) => `url(${image})`,
    display: 'grid',
    alignContent: 'center',
    justifyContent: 'center',
  },
  subContainer: {
    display: 'grid',
    justifyContent: 'center',
    alignContent: 'center',
  },
  subsubContainer: {
    background: colors.background,
    minWidth: '400px',
    display: 'grid',
    padding: padding.standard,
    gridGap: padding.large,
  },
  largeHeader: {
    fontFamily: fontFamilies.header,
    fontSize: '4rem',
  },
  smallHeader: {
    fontFamily: fontFamilies.header,
    fontSize: '2.5rem',
  },
  subsubsubContainer: {
    display: 'grid',
    gridGap: padding.standard,
  },
  loginText: {
    fontSize: '1rem',
  },
}));

const LoginPage = (): ReactElement => {
  const { instance } = useMsal();
  const classes = useStyles({ image: loginBg });

  const login = async () => {
    await instance.loginPopup(loginRequest);
  };

  return (
    <div className={classes.container}>
      <div className={classes.image}>
        <Typography color="secondary" variant="body1" className={classes.largeHeader}>
          KomPass 2.0
        </Typography>
        <Typography color="secondary" variant="h2" className={classes.mediumHeader}>
          Skapa bättre kompetensdagar
        </Typography>
      </div>
      <div className={classes.subContainer}>
        <div className={classes.subsubContainer}>
          <Typography color="primary" variant="body1" className={classes.smallHeader}>
            KomPass 2.0
          </Typography>

          <div className={classes.subsubsubContainer}>
            <Typography variant="h6" className={classes.loginText}>
              Logga in på Kompassen2
            </Typography>
            <Button color="primary" variant="contained" onClick={login}>
              Logga in med Azure AD
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
