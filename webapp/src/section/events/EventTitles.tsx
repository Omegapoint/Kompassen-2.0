import { createStyles, makeStyles, Typography } from '@material-ui/core';
import { ReactElement } from 'react';
import { padding } from '../../theme/Theme';

const useStyles = makeStyles(() =>
  createStyles({
    container: {
      display: 'grid',
      gridTemplateColumns: '3fr 3fr 2fr 2fr 26px',
      alignItems: 'center',
      padding: `${padding.small} 21px 0 21px`,
    },
    centered: {
      justifySelf: 'center',
    },
  })
);

const EventTitles = (): ReactElement => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <Typography>Plats</Typography>
      <Typography>Datum</Typography>
      <Typography className={classes.centered}>Anmälda</Typography>
      <Typography className={classes.centered}>Obehandlade</Typography>
      <div />
    </div>
  );
};

export default EventTitles;
