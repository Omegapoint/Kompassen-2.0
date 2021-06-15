import React, { ReactElement } from 'react';
import { IconButton, Badge, makeStyles, Link } from '@material-ui/core';
import { Notifications } from '@material-ui/icons';
import { NavLink } from 'react-router-dom';
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
    textDecoration: 'none',
    color: 'white',
  },
}));

const Header = (): ReactElement => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <Link
        component={NavLink}
        to="/"
        color="secondary"
        variant="subtitle1"
        className={classes.header}
      >
        KomPass 2.0
      </Link>
      <User firstName="Jonas" lastName="Sjödin" />

      <IconButton>
        <Badge badgeContent={4} color="secondary">
          <Notifications htmlColor={colors.white} />
        </Badge>
      </IconButton>
    </div>
  );
};

export default Header;
