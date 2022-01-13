import { Box, Typography } from '@mui/material';
import React, { ReactElement } from 'react';
import { Event, Lecture } from '../../lib/Types';
import { colors, padding } from '../../theme/Theme';
import ScheduleContent from './ScheduleContent';

interface ScheduleProps {
  event: Event;
  lectures: Lecture[];
  editable: boolean;
}

const Schedule = ({ event, lectures, editable }: ScheduleProps): ReactElement => (
  <Box
    sx={{
      display: 'grid',
      background: colors.white,
      padding: padding.standard,
      gridGap: padding.standard,
      gridTemplateAreas: `".    titles"
                          "time schedule"`,
      gridTemplateColumns: 'max-content 1fr',
    }}
  >
    {event.rooms.length ? (
      <ScheduleContent event={event} lectures={lectures} editable={editable} />
    ) : (
      <Typography
        variant="h5"
        sx={{ paddingTop: padding.standard, gridColumn: 'span 2', textAlign: 'center' }}
      >
        Det finns inga rum att schemalägga pass i.
      </Typography>
    )}
  </Box>
);

export default Schedule;
