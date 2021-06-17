import { ReactElement } from 'react';
import { IconButton, makeStyles, Theme, Typography } from '@material-ui/core';
import { AccountCircle } from '@material-ui/icons';
import { borderRadius, colors, padding } from '../../theme/Theme';

interface RowProps {
  sender: string;
  message: string;
  date: Date;
}

interface StyleProps {
  position: 'end' | 'start';
}

const useStyles = makeStyles<Theme, StyleProps>(() => ({
  container: {
    display: 'grid',
  },
  subContainer: {
    justifySelf: ({ position }) => position,
    display: 'grid',
    gridGap: padding.minimal,
    gridAutoFlow: 'column',
    alignItems: 'start',
    maxWidth: '80%',
    padding: 0,
  },
  message: {
    background: colors.lightBlue,
    padding: padding.minimal,
    borderRadius: borderRadius.standard,
  },
  date: {
    alignSelf: 'center',
  },
}));

const monthNames = [
  'januari',
  'februari',
  'mars',
  'april',
  'maj',
  'juni',
  'juli',
  'augusti',
  'september',
  'november',
  'december',
];

const isToday = (date: Date) => {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

const padTime = (str: number): string => (str.toString().length === 2 ? str.toString() : `0${str}`);

const formatDate = (date: Date): string => {
  const today = isToday(date);
  if (today) {
    const hours = padTime(date.getHours());
    const minutes = padTime(date.getMinutes());
    return `idag ${hours}:${minutes}`;
  }
  return `${date.getDate().toString()} ${monthNames[date.getMonth()]}`;
};

const Row = ({ sender, message, date }: RowProps): ReactElement => {
  const classes = useStyles({ position: sender === 'jonas' ? 'end' : 'start' });

  return (
    <div className={classes.container}>
      <div className={classes.subContainer}>
        <IconButton>
          <AccountCircle />
        </IconButton>
        <Typography className={classes.message}>{message}</Typography>
        <Typography variant="subtitle1" className={classes.date}>
          {formatDate(date)}
        </Typography>
      </div>
    </div>
  );
};

export default Row;
