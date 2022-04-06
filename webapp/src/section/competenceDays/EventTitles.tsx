import { Box, Typography } from '@mui/material';
import { ReactElement } from 'react';
import { padding } from '../../theme/Theme';

const EventTitles = (): ReactElement => (
  <Box
    sx={{
      display: 'grid',
      gridTemplateColumns: '3fr 3fr 2fr 2fr 26px',
      alignItems: 'center',
      padding: `${padding.small} 21px 0 21px`,
    }}
  >
    <Typography>Plats</Typography>
    <Typography>Datum</Typography>
    <Typography sx={{ justifySelf: 'center' }}>Anmälda</Typography>
    <Typography sx={{ justifySelf: 'center' }}>Obehandlade</Typography>
    <div />
  </Box>
);

export default EventTitles;
