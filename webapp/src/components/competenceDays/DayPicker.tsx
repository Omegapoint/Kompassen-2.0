import { Button, makeStyles, Typography } from '@material-ui/core';
import { format } from 'date-fns';
import { sv } from 'date-fns/locale';
import { ReactElement, useContext } from 'react';
import { ReactComponent as TinyArrow } from '../../assets/tinyArrow.svg';
import { useAppSelector } from '../../lib/Lib';
import { Event } from '../../lib/Types';
import { borderRadius, colors, padding } from '../../theme/Theme';
import EventContext from './EventContext';

const useStyles = makeStyles(() => ({
  container: {
    display: 'grid',
    gridTemplateColumns: 'min-content 1fr min-content',
    gridGap: padding.standard,
    alignItems: 'center',
    justifyItems: 'center',
    backgroundColor: colors.background,
    borderRadius: borderRadius.tiny,
  },
  button: {
    backgroundColor: colors.primary,
    padding: `${padding.minimal} ${padding.tiny}`,
    minWidth: 0,
    lineHeight: 1,
    '&:disabled': {
      '& path': {
        fill: colors.grey,
      },
    },
  },
  leftButton: {
    borderRadius: `${borderRadius.tiny} 0 0 ${borderRadius.tiny}`,
  },
  rightButton: {
    borderRadius: `0 ${borderRadius.tiny} ${borderRadius.tiny} 0`,
  },
}));

export const formatEventTime = (event: Event): string => {
  const startTime = format(event.startAt, 'dd MMM HH:mm', { locale: sv });
  const endTime = format(event.endAt, 'HH:mm', { locale: sv });
  return `${startTime}-${endTime}`;
};

const DayPicker = (): ReactElement => {
  const classes = useStyles();
  const { events, ind, setInd } = useContext(EventContext);
  const organisations = useAppSelector((state) => state.organisations);

  const event = events[ind];
  const organisation = organisations.find((e) => e.id === event.organisationID)?.name;

  const previousEvent = () => setInd((i) => (i > 0 ? i - 1 : i));
  const nextEvent = () => setInd((i) => (i <= events.length - 1 ? i + 1 : i));

  return (
    <div className={classes.container}>
      <Button
        color="primary"
        variant="contained"
        disabled={ind === 0}
        className={`${classes.button} ${classes.leftButton}`}
        onClick={previousEvent}
      >
        <TinyArrow width={10} height={10} transform="rotate(180)" />
      </Button>
      <Typography>{`${organisation} ${formatEventTime(event)}`}</Typography>
      <Button
        color="primary"
        variant="contained"
        disabled={ind >= events.length - 1}
        className={`${classes.button} ${classes.rightButton}`}
        onClick={nextEvent}
      >
        <TinyArrow width={10} height={10} />
      </Button>
    </div>
  );
};

export default DayPicker;
