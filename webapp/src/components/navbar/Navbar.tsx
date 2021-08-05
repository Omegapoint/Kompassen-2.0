import { Badge, IconButton, Link, makeStyles } from '@material-ui/core';
import { Notifications } from '@material-ui/icons';
import { ReactElement } from 'react';
import { NavLink } from 'react-router-dom';
import { colors, constants, fontFamilies, padding } from '../../theme/Theme';
import User from './User';

const useStyles = makeStyles(() => ({
  container: {
    display: 'grid',
    gridTemplateColumns: '1fr repeat(2, 50px)',
    alignItems: 'center',
    padding: `0 ${padding.standard}`,
    background: colors.primary,
    justifyItems: 'right',
    gridAutoFlow: 'column',
    height: constants.headerHeight,
  },
  header: {
    justifySelf: 'left',
    fontFamily: fontFamilies.header,
    fontSize: '1.6rem',
    textDecoration: 'none',
    color: 'white',
  },
}));

const Navbar = (): ReactElement => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <Link component={NavLink} to="/" color="secondary" variant="body1" className={classes.header}>
        KomPass 2.0
      </Link>
      <User />

      <IconButton>
        <Badge badgeContent={4} color="secondary">
          <Notifications htmlColor={colors.white} />
        </Badge>
      </IconButton>
    </div>
  );
};

export default Navbar;
