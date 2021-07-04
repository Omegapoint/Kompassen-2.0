import { createStyles, makeStyles, Typography, Divider } from '@material-ui/core';
import { ChangeEvent, ReactElement, useEffect, useState } from 'react';
import { padding } from '../../theme/Theme';
import Profile from './Profile';
import Notifications from './Notifications';
import { useUpdateUser } from '../../lib/Hooks';
import { useAppSelector } from '../../lib/Lib';

const useStyles = makeStyles(() =>
  createStyles({
    container: {
      width: '100%',
      display: 'grid',
      gridTemplateRows: 'max-content auto auto auto auto',
      gridGap: `${padding.medium} ${padding.large}`,
      padding: '0 20px',
      '& > :nth-child(1)': {
        gridColumn: '1 / 2',
      },
    },
    wrapper: {
      display: 'grid',
      gridGap: `${padding.small}`,
    },
  })
);

const Settings = (): ReactElement => {
  const classes = useStyles();
  const user = useAppSelector((state) => state.user);
  const [, updateUserRequest] = useUpdateUser();
  const [checked, setChecked] = useState(user.notifications);

  useEffect(() => {
    updateUserRequest({ body: { id: user.id, notifications: checked } });
  }, [checked, user.id, updateUserRequest]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setChecked({ ...checked, [event.target.name]: event.target.checked });
  };

  return (
    <div className={classes.container}>
      <Typography variant="h1">Inställningar</Typography>
      <div className={classes.wrapper}>
        <Typography variant="h2">Min Profil</Typography>
        <Divider />
        <Profile />
        <Typography variant="h2">Hantera Notiser</Typography>
        <Divider />
        <Notifications handleChange={handleChange} checked={checked} />
      </div>
    </div>
  );
};

export default Settings;
