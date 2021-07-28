import { createStyles, Divider, makeStyles, Typography } from '@material-ui/core';
import { ChangeEvent, ReactElement, useEffect, useState } from 'react';
import { useMutation } from 'react-query';
import { updateUser } from '../../api/Api';
import useInvalidateOnSuccess from '../../hooks/UseInvalidateOnSuccess';
import { useAppSelector } from '../../lib/Lib';
import { padding } from '../../theme/Theme';
import Notifications from './Notifications';
import Profile from './Profile';

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
  const { mutate, isSuccess } = useMutation(updateUser);
  useInvalidateOnSuccess(isSuccess, 'user');

  const [checked, setChecked] = useState(user.notifications);

  useEffect(() => {
    mutate({ id: user.id, notifications: checked });
  }, [checked, user.id, mutate]);

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
