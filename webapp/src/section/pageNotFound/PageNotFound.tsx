import { makeStyles, Paper, Typography } from '@material-ui/core';
import { ReactElement } from 'react';
import { padding } from '../../theme/Theme';

const useStyles = makeStyles(() => ({
  container: {
    width: '100%',
    display: 'grid',
    justifyContent: 'center',
    padding: '20px',
  },
  content: {
    display: 'grid',
    justifyContent: 'center',
    gridGap: padding.minimal,
    padding: padding.medium,
    '& h6': {
      lineHeight: 1,
    },
  },
}));

const PageNotFound = (): ReactElement => {
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <Paper className={classes.content}>
        <Typography variant="h1">Woops, 404</Typography>
        <Typography variant="h2">Sidan kunde inte hittas</Typography>
      </Paper>
    </div>
  );
};
export default PageNotFound;
