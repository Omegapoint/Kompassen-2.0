import { Avatar, IconButton, makeStyles, Theme, Typography } from '@material-ui/core';
import { ReactElement } from 'react';
import useAzureUser from '../../hooks/UseAzureUser';
import { useAppSelector } from '../../lib/Lib';
import { LectureMessage } from '../../lib/Types';
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
    direction: 'ltr',
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
  avatar: {
    backgroundColor: colors.grey,
    color: colors.white,
    fontSize: '1rem',
    width: '34px',
    height: '34px',
  },
}));

interface RowProps {
  message: LectureMessage;
}

const Row = ({ message }: RowProps): ReactElement => {
  const user = useAppSelector((state) => state.user);
  const classes = useStyles({ isSender: message.userID === user.id });
  const { initials, name } = useAzureUser(message.userID);

  return (
    <div className={classes.subContainer}>
      <IconButton className={classes.icon}>
        <Avatar className={classes.avatar}>{initials}</Avatar>
      </IconButton>
      <div>
        <Typography variant="subtitle1">{name}</Typography>
        <Typography className={classes.message}>{message.message}</Typography>
      </div>
      <Typography variant="subtitle1" className={classes.date}>
        {formatDate(message.createdAt)}
      </Typography>
    </div>
  );
};

export default Row;
