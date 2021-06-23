import { ReactElement } from 'react';
import { createStyles, makeStyles } from '@material-ui/core';
import Router from '../../api/Router';
import { padding } from '../../theme/Theme';
import CurrentPath from '../currentPath/CurrentPath';

const useStyles = makeStyles(() =>
  createStyles({
    container: {
      display: 'grid',
      padding: padding.standard,
      justifyContent: 'center',
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
