import { Box, Typography } from '@mui/material';
import { ReactElement } from 'react';
import useEventLecturesWS from '../../section/competencedayPlanner/UseEventLecturesWS';
import { padding } from '../../theme/Theme';
import ManuallyScheduledLectures from './ManuallyScheduledLectures';

const OPKoKoModeratorView = (): ReactElement => {
  const lectures = useEventLecturesWS('2a752f77-c5d7-4e1a-9c8b-d232282d6d2b');

  return (
    <>
      <Typography variant="h1" sx={{ gridColumn: 'span 2' }}>
        Anmäl intresse för att vara rumsvärd
      </Typography>

      <Box
        sx={{
          display: 'grid',
          gridGap: padding.standard,
          alignContent: 'start',
        }}
      >
        <ManuallyScheduledLectures lectures={lectures} />
      </Box>
    </>
  );
};

export default OPKoKoModeratorView;
