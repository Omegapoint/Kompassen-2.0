import React, { FC } from 'react';
import { Link } from 'react-router-dom';
import { Typography, IconButton, Badge, makeStyles } from '@material-ui/core';
import NotificationsIcon from '@material-ui/icons/Notifications';
import { colors, fontFamilies } from '../../theme/theme';
import User from './user';

const useStyles = makeStyles(() => ({
  container: {
    display: 'grid',
    gridTemplateColumns: '1fr repeat(2, 50px)',
    alignItems: 'center',
    padding: '0 20px',
    background: colors.primary,
    justifyItems: 'right',
    gridAutoFlow: 'column',
    height: '50px',
  },
  header: {
    justifySelf: 'left',
    fontFamily: fontFamilies.header,
    fontSize: '1.6rem',
    '& a': {
      textDecoration: 'none',
      color: 'white',
    },
  },
}));

const Header: FC = () => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <Typography className={classes.header}>
        <Link to="/">KomPass 2.0</Link>
      </Typography>
      <User firstName="Jonas" lastName="Sjödin" />

      <IconButton>
        <Badge badgeContent={4} color="secondary">
          <NotificationsIcon htmlColor={colors.white} />
        </Badge>
      </IconButton>
    </div>
  );
};

export default Header;
