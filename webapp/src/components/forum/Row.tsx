import { ReactElement } from 'react';
import { IconButton, makeStyles, Theme, Typography } from '@material-ui/core';
import { AccountCircle } from '@material-ui/icons';
import { borderRadius, colors, padding } from '../../theme/Theme';

const monthNames = ['jan', 'feb', 'mar', 'apr', 'maj', 'jun', 'jul', 'aug', 'sep', 'nov', 'dec'];

const isToday = (date: Date) => {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

const padTime = (str: number): string => (str.toString().length === 2 ? str.toString() : `0${str}`);

export const formatDate = (date: Date): string => {
  const today = isToday(date);
  if (today) {
    const hours = padTime(date.getHours());
    const minutes = padTime(date.getMinutes());
    return `idag ${hours}:${minutes}`;
  }
  return `${date.getDate().toString()} ${monthNames[date.getMonth()]}`;
};

interface StyleProps {
  isSender: boolean;
}

const useStyles = makeStyles<Theme, StyleProps>(() => ({
  subContainer: {
    justifySelf: ({ isSender }) => (isSender ? 'end' : 'start'),
    display: 'grid',
    gridGap: padding.minimal,
    gridAutoFlow: 'column',
    alignItems: 'start',
    maxWidth: '80%',
    direction: ({ isSender }) => (isSender ? 'rtl' : 'ltr'),
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
  icon: {
    padding: 0,
    width: '36px',
    height: '36px',
  },
}));

interface RowProps {
  sender: string;
  message: string;
  date: Date;
}

const Row = ({ sender, message, date }: RowProps): ReactElement => {
  const classes = useStyles({ isSender: sender === 'jonas' });

  return (
    <div className={classes.subContainer}>
      <IconButton className={classes.icon}>
        <AccountCircle className={classes.icon} />
      </IconButton>
      <Typography className={classes.message}>{message}</Typography>
      <Typography variant="subtitle1" className={classes.date}>
        {formatDate(date)}
      </Typography>
    </div>
  );
};

export default Row;
