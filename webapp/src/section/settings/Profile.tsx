import { createStyles, makeStyles, Typography } from '@material-ui/core';
import { ReactElement } from 'react';
import { padding } from '../../theme/Theme';

const useStyles = makeStyles(() =>
  createStyles({
    myProfile: {
      display: 'grid',
      gridGap: `${padding.minimal} ${padding.large}`,
      paddingTop: padding.standard,
      paddingBottom: padding.large,
      gridTemplateColumns: 'max-content max-content',
    },
    bold: {
      fontWeight: 400,
    },
  })
);

const Profile = (): ReactElement => {
  const classes = useStyles();

  return (
    <div className={classes.myProfile}>
      <Typography>Namn</Typography>
      <Typography className={classes.bold}>Susane Bakoush</Typography>
      <Typography>Epost</Typography>
      <Typography className={classes.bold}>susan.bakoush@omegapoint</Typography>
    </div>
  );
};
export default Profile;
