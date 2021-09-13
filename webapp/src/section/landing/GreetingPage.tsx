import { makeStyles, Typography } from '@material-ui/core';
import { ReactElement, ReactNode } from 'react';
import loginBg from '../../assets/loginBg.svg';
import { fontFamilies } from '../../theme/Theme';

const useStyles = makeStyles(() => ({
  container: {
    display: 'grid',
    gridTemplateColumns: '1fr 2fr',
    height: '100vh',
  },
  image: {
    background: `url(${loginBg})`,
    display: 'grid',
    alignContent: 'center',
    justifyContent: 'center',
  },
  contentContainer: {
    display: 'grid',
    justifyContent: 'center',
    alignContent: 'center',
  },
  largeHeader: {
    fontFamily: fontFamilies.header,
    fontSize: '4rem',
  },
}));

interface GreetingPageProps {
  children: ReactNode;
}

const GreetingPage = ({ children }: GreetingPageProps): ReactElement => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <div className={classes.image}>
        <Typography color="secondary" variant="body1" className={classes.largeHeader}>
          KomPass 2.0
        </Typography>
        <Typography color="secondary" variant="h2">
          Skapa bättre kompetensdagar
        </Typography>
      </div>
      <div className={classes.contentContainer}>{children}</div>
    </div>
  );
};

export default GreetingPage;
