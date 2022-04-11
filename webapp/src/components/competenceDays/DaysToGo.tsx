import { Box, Typography } from '@mui/material';
import { differenceInDays, intervalToDuration, isWithinInterval } from 'date-fns';
import { ReactElement, useContext, useEffect, useState } from 'react';
import useBoolean from '../../hooks/UseBoolean';
import { Event } from '../../lib/Types';
import { borderRadius, colors, padding } from '../../theme/Theme';
import EventContext from './EventContext';

interface Time {
  days: number;
  hours: number;
  minutes: number;
}

const getTime = (event: Event, eventTime?: boolean): Time => {
  const days = differenceInDays(eventTime ? event.registrationEnd : event.startAt, new Date());
  const { hours, minutes } = intervalToDuration({ start: event.startAt, end: new Date() });
  return { days, hours: hours || 0, minutes: minutes || 0 };
};

interface DaysToGoProps {
  eventTime?: boolean,
}

const DaysToGo = ({eventTime}: DaysToGoProps): ReactElement => {
  const { events, ind } = useContext(EventContext);



  const [{ days, hours, minutes }, setDates] = useState<Time>(getTime(events[ind], eventTime));
  const [isOngoing, ongoing] = useBoolean();


  useEffect(() => {
    setDates(getTime(events[ind], eventTime));
    const interval = setInterval(() => setDates(getTime(events[ind], eventTime)), 5 * 1000);
    return () => clearInterval(interval);
  }, [events, ind, eventTime]);

  const data = [
    { nr: days, desc: 'dagar' },
    { nr: hours, desc: 'timmar' },
    { nr: minutes, desc: 'min' },
  ];

  useEffect(() => {
    if (isWithinInterval(new Date(), { start: events[ind].startAt, end: events[ind].endAt }))
      ongoing.on();
    else ongoing.off();
  }, [minutes, events, ind, ongoing]);

  return (
    <Box
      sx={{
        display: 'flex',
        gridGap: padding.small,
        justifyContent: 'center',
        background: !isOngoing ? colors.background : colors.blue,
        padding: `${padding.minimal} 0`,
        borderRadius: borderRadius.tiny,
      }}
    >
      {!isOngoing &&
        data.map((e) => (
          <Box key={e.desc} sx={{ display: 'flex', alignItems: 'center', gridGap: padding.tiny }}>
            <Typography
              sx={{
                background: colors.primary,
                color: colors.white,
                lineHeight: 1,
                fontSize: '0.8rem',
                padding: padding.tiny,
                borderRadius: borderRadius.tiny,
              }}
            >
              {e.nr}
            </Typography>
            <Typography sx={{ lineHeight: 1, color: colors.primary }}>{e.desc}</Typography>
          </Box>
        ))}
      {isOngoing && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gridGap: padding.tiny,
          }}
        >
          <Typography sx={{ lineHeight: 1, color: colors.white }}>Pågår nu!</Typography>
        </Box>
      )}
    </Box>
  );
};

export default DaysToGo;
