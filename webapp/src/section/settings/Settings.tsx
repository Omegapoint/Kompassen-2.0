import { createStyles, makeStyles, Typography, Divider } from '@material-ui/core';
import React, { ReactElement } from 'react';
import { padding } from '../../theme/Theme';
import Profile from './Profile';
import Notifications from './Notifications';

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

  const [checked, setChecked] = React.useState({
    newPosts: true,
    commentedPost: true,
    adminReadPost: true,
    responsibleClass: true,
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | null>) => {
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
