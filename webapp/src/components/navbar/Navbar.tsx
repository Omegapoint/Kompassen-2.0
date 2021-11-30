import { Notifications } from '@mui/icons-material';
import { Badge, Box, IconButton, Link } from '@mui/material';
import { ReactElement } from 'react';
import { NavLink } from 'react-router-dom';
import { colors, constants, fontFamilies, padding } from '../../theme/Theme';
import User from './User';

const Navbar = (): ReactElement => (
  <Box
    sx={{
      display: 'grid',
      gridTemplateColumns: '1fr repeat(2, 50px)',
      alignItems: 'center',
      padding: `0 ${padding.standard}`,
      background: colors.primary,
      justifyItems: 'right',
      gridAutoFlow: 'column',
      height: constants.headerHeight,
    }}
  >
    <Link
      component={NavLink}
      to="/"
      color="secondary"
      variant="body1"
      sx={{
        justifySelf: 'left',
        fontFamily: fontFamilies.header,
        fontSize: '1.6rem',
        textDecoration: 'none',
        color: 'white',
      }}
    >
      KomPass 2.0
    </Link>
    <User />

    <IconButton size="large">
      <Badge badgeContent={0} color="secondary">
        <Notifications htmlColor={colors.white} />
      </Badge>
    </IconButton>
  </Box>
);

export default Navbar;
