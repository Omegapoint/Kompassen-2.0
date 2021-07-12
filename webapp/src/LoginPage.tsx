import { ReactElement } from 'react';
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
    background: colors.background,
    minWidth: '400px',
    display: 'grid',
    padding: padding.standard,
    gridGap: padding.large,
  },
  header: {
    fontFamily: fontFamilies.header,
    fontSize: '2.5rem',
  },
  loginContainer: {
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

  const login = async () => instance.loginPopup(loginRequest);

  return (
    <div className={classes.container}>
      <Typography color="primary" variant="body1" className={classes.header}>
        KomPass 2.0
      </Typography>

      <div className={classes.loginContainer}>
        <Typography variant="h6" className={classes.loginText}>
          Logga in på Kompassen2
        </Typography>
        <Button color="primary" variant="contained" onClick={login}>
          Logga in med Azure AD
        </Button>
      </div>
    </div>
  );
};

export default LoginPage;
