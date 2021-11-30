import { Box, Paper, Typography } from '@mui/material';
import { ReactElement } from 'react';
import { padding } from '../../theme/Theme';

const PageNotFound = (): ReactElement => (
  <Box
    sx={{
      width: '100%',
      display: 'grid',
      justifyContent: 'center',
      padding: '20px',
    }}
  >
    <Paper
      sx={{
        display: 'grid',
        justifyContent: 'center',
        gridGap: padding.minimal,
        padding: padding.medium,
        '& h6': {
          lineHeight: 1,
        },
      }}
    >
      <Typography variant="h1">Woops, 404</Typography>
      <Typography variant="h2">Sidan kunde inte hittas</Typography>
    </Paper>
  </Box>
);
export default PageNotFound;
