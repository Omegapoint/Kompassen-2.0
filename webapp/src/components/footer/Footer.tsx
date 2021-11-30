import { Box, Typography } from '@mui/material';
import { ReactElement } from 'react';
import { padding } from '../../theme/Theme';

const Footer = (): ReactElement => (
  <Box
    sx={{
      display: 'grid',
      justifyItems: 'center',
      padding: padding.standard,
    }}
  >
    <Typography>© Copyright 2021 Omegapoint Group AB</Typography>
  </Box>
);

export default Footer;
