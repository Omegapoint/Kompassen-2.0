import { Box, CircularProgress } from '@mui/material';
import { ReactElement } from 'react';

const SmallLoader = (): ReactElement => (
  <Box
    sx={{
      display: 'grid',
      width: '100%',
      height: '100%',
      justifyContent: 'center',
      alignContent: 'center',
    }}
  >
    <CircularProgress />
  </Box>
);

export default SmallLoader;
