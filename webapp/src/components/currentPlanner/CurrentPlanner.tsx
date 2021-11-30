import { Box, Link, Typography } from '@mui/material';
import { ReactElement } from 'react';
import { NavLink } from 'react-router-dom';
import { colors, padding } from '../../theme/Theme';

const linkStyle = { color: colors.black, textDecoration: 'underline' };

const CurrentPlanner = (): ReactElement => (
  <Box
    sx={{
      display: 'grid',
      gridTemplateColumns: 'max-content max-content',
      gridGap: `${padding.tiny} ${padding.standard}`,
    }}
  >
    <Typography>Stockholm</Typography>
    <Link sx={linkStyle} component={NavLink} to="/" variant="body1">
      Jan Bananberg
    </Link>
    <Typography>Umeå</Typography>
    <Link sx={linkStyle} component={NavLink} to="/" variant="body1">
      Jannica Apelsinskog
    </Link>
  </Box>
);

export default CurrentPlanner;
