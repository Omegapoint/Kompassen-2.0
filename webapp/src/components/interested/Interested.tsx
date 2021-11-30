import { Box, Button, Link, Typography } from '@mui/material';
import { ReactElement } from 'react';
import { NavLink } from 'react-router-dom';
import { colors, padding } from '../../theme/Theme';

const Interested = (): ReactElement => (
  <Box
    sx={{
      display: 'grid',
      gridTemplateColumns: '1fr max-content',
      gridTemplateAreas: `"text text"
                          ". button"`,
      gridGap: `${padding.small}`,
    }}
  >
    <Typography sx={{ gridArea: 'text' }}>
      {`Kolla in vår guide för att hålla i ett pass, eller fråga `}
      <Link
        sx={{ color: colors.black, textDecoration: 'underline' }}
        component={NavLink}
        to="/"
        variant="body1"
      >
        en av de nuvarande planerarna.
      </Link>
    </Typography>
    <Button sx={{ gridArea: 'button' }} color="primary" variant="contained">
      Till passguiden
    </Button>
  </Box>
);

export default Interested;
