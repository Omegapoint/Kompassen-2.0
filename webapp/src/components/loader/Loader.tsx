import React, { ReactElement } from 'react';
import { CircularProgress, createStyles, makeStyles } from '@material-ui/core';

const useStyles = makeStyles(() =>
  createStyles({
    loadingScreen: {
      display: 'grid',
      width: '100vw',
      height: '100vh',
      justifyContent: 'center',
      alignContent: 'center',
    },
  })
);

const Loader = (): ReactElement => {
  const classes = useStyles();

  return (
    <div className={classes.loadingScreen}>
      <CircularProgress />
    </div>
  );
};

export default Loader;
