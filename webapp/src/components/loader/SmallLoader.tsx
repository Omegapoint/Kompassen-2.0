import { ReactElement } from 'react';
import { CircularProgress, createStyles, makeStyles } from '@material-ui/core';

const useStyles = makeStyles(() =>
  createStyles({
    loadingScreen: {
      display: 'grid',
      width: '100%',
      height: '100%',
      justifyContent: 'center',
      alignContent: 'center',
    },
  })
);

const SmallLoader = (): ReactElement => {
  const classes = useStyles();

  return (
    <div className={classes.loadingScreen}>
      <CircularProgress />
    </div>
  );
};

export default SmallLoader;
