import { makeStyles, Typography } from '@material-ui/core';
import { differenceInDays, intervalToDuration } from 'date-fns';
import { ReactElement, useContext, useEffect, useState } from 'react';
import { Event } from '../../lib/Types';
import { borderRadius, colors, padding } from '../../theme/Theme';
import EventContext from './EventContext';

const useStyles = makeStyles(() => ({
  container: {
    display: 'flex',
    gridGap: padding.small,
    justifyContent: 'center',
    background: colors.background,
    padding: `${padding.minimal} 0`,
    borderRadius: borderRadius.tiny,
  },
  nr: {
    background: colors.primary,
    color: colors.white,
    lineHeight: 1,
    fontSize: '1.2rem',
    padding: padding.tiny,
    borderRadius: borderRadius.tiny,
  },
  desc: {
    lineHeight: 1,
    color: colors.primary,
  },
  subContainer: {
    display: 'flex',
    alignItems: 'center',
    gridGap: padding.tiny,
  },
}));

interface Time {
  days: number;
  hours: number;
  minutes: number;
}

const getTime = (event: Event): Time => {
  const days = differenceInDays(event.startAt, new Date());
  const { hours, minutes } = intervalToDuration({ start: event.startAt, end: new Date() });
  return { days, hours: hours || 0, minutes: minutes || 0 };
};

const DaysToGo = (): ReactElement => {
  const classes = useStyles();
  const { events, ind } = useContext(EventContext);

  const [{ days, hours, minutes }, setDates] = useState<Time>(getTime(events[ind]));

  useEffect(() => {
    setDates(getTime(events[ind]));
    const interval = setInterval(() => setDates(getTime(events[ind])), 5 * 1000);
    return () => clearInterval(interval);
  }, [events, ind]);

  const data = [
    { nr: days, desc: 'dagar' },
    { nr: hours, desc: 'h' },
    { nr: minutes, desc: 'min' },
  ];

  return (
    <div className={classes.container}>
      {data.map((e) => (
        <div key={e.desc} className={classes.subContainer}>
          <Typography className={classes.nr}>{e.nr}</Typography>
          <Typography className={classes.desc}>{e.desc}</Typography>
        </div>
      ))}
    </div>
  );
};

export default DaysToGo;
