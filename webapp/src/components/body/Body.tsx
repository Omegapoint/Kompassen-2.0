import { createStyles, makeStyles } from '@material-ui/core';
import { ReactElement } from 'react';
import Router from '../../router/Router';
import { padding } from '../../theme/Theme';
import CurrentPath from '../currentPath/CurrentPath';

const useStyles = makeStyles(() =>
  createStyles({
    container: {
      display: 'grid',
      width: '100%',
      padding: padding.standard,
      maxWidth: '1500px',
      justifySelf: 'center',
    },
  })
);

const Body = (): ReactElement => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <CurrentPath />
      <Router />
    </div>
  );
};

export default Body;
