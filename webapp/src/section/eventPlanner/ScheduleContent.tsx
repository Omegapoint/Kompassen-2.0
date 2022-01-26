import { Box, Divider, Typography } from '@mui/material';
import { addMinutes, format } from 'date-fns';
import { sv } from 'date-fns/locale';
import React, { ReactElement, useEffect, useRef, useState } from 'react';
import { Event, Lecture } from '../../lib/Types';
import { colors, padding } from '../../theme/Theme';
import ScheduleArea from './ScheduleArea';
import Sideline from './Sideline';
import useSchedule, { MINUTES } from './UseSchedule';

interface ScheduleContentProps {
  event: Event;
  lectures: Lecture[];
  editable: boolean;
}

const ScheduleContent = ({ event, lectures, editable }: ScheduleContentProps): ReactElement => {
  const sortedDurations = lectures.map((e) => e.duration || 0).sort();
  const longestDuration = sortedDurations.length ? sortedDurations[sortedDurations.length - 1] : 0;
  const scheduleRef = useRef<HTMLDivElement>(null);
  const [totWidth, setTotWidth] = useState(0);
  const [totHeight, setTotHeight] = useState(0);
  const colWidth = totWidth / event.rooms.length;
  const { handleDragStop, numRows, sideline, scheduled } = useSchedule(event, lectures, colWidth);

  useEffect(() => {
    setTotWidth(scheduleRef.current?.offsetWidth || 0);
    setTotHeight(scheduleRef.current?.offsetHeight || 0);
  }, [event.rooms]);

  const rowToTime = (col: number) => {
    const newTime = addMinutes(event.startAt, col * MINUTES);
    return newTime < event.startAt ? event.startAt : newTime;
  };

  return (
    <>
      <Box
        sx={{
          display: 'grid',
          gridArea: 'titles',
          gridAutoFlow: 'column',
          gridAutoColumns: '1fr',
          gridGap: padding.standard,
        }}
      >
        {event.rooms.map((room, i) => (
          <div key={room.id}>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr max-content' }}>
              <Typography variant="h6">
                Rum {i + 1}: {event.rooms[i].name}
              </Typography>
              {/* <Typography variant="h6">0h</Typography> */}
            </Box>
            <Divider sx={{ background: colors.black, height: '3px' }} />
          </div>
        ))}
      </Box>
      <Box
        sx={{
          position: 'relative',
          display: 'grid',
          gridArea: 'time',
          justifyItems: 'center',
          alignContent: 'space-between',
          top: '-11px',
          height: totHeight + 20,
        }}
      >
        {[
          ...[...new Array(numRows)]
            .map((_, i) => i * MINUTES)
            .filter((e) => e % 30 === 0)
            .map((e) => addMinutes(event.startAt, e)),
          event.endAt,
        ].map((date) => (
          <Typography key={date.toString()}>{format(date, 'HH:mm', { locale: sv })}</Typography>
        ))}
      </Box>
      <Box
        className="fullSchedule"
        sx={{
          position: 'relative',
          gridArea: 'schedule',
          gridGap: 25,
          display: 'grid',
        }}
      >
        <div ref={scheduleRef}>
          <ScheduleArea
            lectures={scheduled}
            colWidth={colWidth}
            rowToTime={rowToTime}
            handleDragStop={handleDragStop}
            editable={editable}
          />
        </div>

        <Sideline
          numRows={numRows}
          longestDuration={longestDuration}
          lectures={sideline}
          totWidth={totWidth}
          handleDragStop={handleDragStop}
        />
      </Box>
    </>
  );
};

export default ScheduleContent;
