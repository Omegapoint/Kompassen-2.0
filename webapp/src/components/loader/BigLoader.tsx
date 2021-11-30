import { Box, CircularProgress } from '@mui/material';
import { ReactElement } from 'react';

const BigLoader = (): ReactElement => (
  <Box
    sx={{
      display: 'grid',
      width: '100vw',
      height: '100vh',
      justifyContent: 'center',
      alignContent: 'center',
    }}
  >
    <CircularProgress />
  </Box>
);

export default BigLoader;
