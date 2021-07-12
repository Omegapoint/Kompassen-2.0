import { ReactElement, useContext } from 'react';
import { Button, makeStyles, Typography } from '@material-ui/core';
import { sv } from 'date-fns/locale';
import { format } from 'date-fns';
import { borderRadius, colors, padding } from '../../theme/Theme';
import { ReactComponent as TinyArrow } from '../../assets/tinyArrow.svg';
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

const DayPicker = (): ReactElement => {
  const classes = useStyles();
  const { events, ind, setInd } = useContext(EventContext);

  const event = events[ind];
  const start = format(event.startAt, 'dd MMMM HH:mm', { locale: sv });
  const endTime = format(event.endAt, 'HH:mm', { locale: sv });

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
      <Typography>{`${event.location} ${start}-${endTime}`}</Typography>
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
