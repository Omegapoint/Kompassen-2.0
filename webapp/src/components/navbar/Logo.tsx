import { Box, Typography } from '@mui/material';
import { ReactElement } from 'react';

const Logo = (): ReactElement => (
  <Box display="flex">
    <Typography
      variant="h1"
      fontFamily="Roboto Slab"
      fontSize="1.6rem"
      fontWeight="400"
      letterSpacing="1px"
      color="white"
    >
      KomPass 2.0
    </Typography>
    <Typography
      variant="h2"
      fontFamily="'Courier New', monospace"
      fontWeight="bold"
      letterSpacing="3px"
      color="#FF8921"
      sx={{
        position: 'relative',
        left: '-30px',
        transform: 'rotate(25deg)',
        textShadow: '2px 2px 1px #000',
      }}
    >
      BETA
    </Typography>
  </Box>
);

export default Logo;
