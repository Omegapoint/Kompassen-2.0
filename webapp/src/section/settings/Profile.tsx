import { createStyles, makeStyles, Typography } from '@material-ui/core';
import { ReactElement } from 'react';
import { useAppSelector } from '../../lib/Lib';
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
  const { azureUser } = useAppSelector((state) => state.session);

  return (
    <div className={classes.myProfile}>
      <Typography>Namn</Typography>
      <Typography className={classes.bold}>{azureUser.displayName}</Typography>
      <Typography>Epost</Typography>
      <Typography className={classes.bold}>{azureUser.mail}</Typography>
    </div>
  );
};
export default Profile;
